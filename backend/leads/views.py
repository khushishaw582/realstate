from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


from users.permissions import IsAdmin, IsAgent
from users.models import User
from .models import Lead
from .serializers import LeadSerializer, LeadCreateSerializer, LeadAssignSerializer
import openpyxl
import csv
import io
from django.utils.dateparse import parse_datetime
from django.db.models import Count
from django.conf import settings
from rest_framework.permissions import AllowAny
import os


def get_least_loaded_agent():
    """Returns the active agent with the fewest currently assigned leads."""
    return (
        User.objects.filter(role='agent', is_active=True)
        .annotate(lead_count=Count('assigned_leads'))
        .order_by('lead_count')
        .first()
    )


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def leads_list_create(request):
    if request.method == 'GET':
        leads = Lead.objects.all().order_by('-created_at')
        serializer = LeadSerializer(leads, many=True)
        return Response(serializer.data)

    # POST — FR-02 Lead Upload with FR-09 Duplicate Detection
    serializer = LeadCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    phone_number = serializer.validated_data['phone_number']
    existing = Lead.objects.filter(phone_number=phone_number).first()

    if existing:
        last_activity = existing.latest_activity
        return Response({
            'customer_name': existing.customer_name,
            'assigned_agent_name': (
                existing.assigned_agent.get_full_name()
                if existing.assigned_agent else 'Unassigned'
            ),
            'last_contact_date': (
                last_activity.created_at.date() if last_activity else None
            ),
        }, status=status.HTTP_409_CONFLICT)

    lead = serializer.save()

    # Auto-assign to least-loaded active agent
    agent = get_least_loaded_agent()
    if agent:
        lead.assigned_agent = agent
        lead.save()

    return Response(LeadSerializer(lead).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def unassigned_leads(request):
    leads = Lead.objects.filter(assigned_agent__isnull=True).order_by('-created_at')
    serializer = LeadSerializer(leads, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def assign_leads(request):
    serializer = LeadAssignSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    lead_ids = serializer.validated_data['lead_ids']
    agent_id = serializer.validated_data['agent_id']

    try:
        agent = User.objects.get(id=agent_id, role='agent')
    except User.DoesNotExist:
        return Response({'error': 'Agent not found'}, status=status.HTTP_404_NOT_FOUND)

    updated = Lead.objects.filter(id__in=lead_ids).update(assigned_agent=agent)
    return Response({'assigned_count': updated})

@api_view(['POST'])
@permission_classes([AllowAny])
def leads_webhook(request):
    secret = request.data.get('secret') or request.headers.get('X-Webhook-Secret')
    if secret != os.environ.get('WEBHOOK_SECRET'):
        return Response({'error': 'Invalid secret'}, status=status.HTTP_403_FORBIDDEN)

    name = str(request.data.get('customer_name', '')).strip()
    phone = str(request.data.get('phone_number', '')).strip()
    location = str(request.data.get('location', '')).strip()
    source = str(request.data.get('source', 'Google Form')).strip()

    if not name or not phone:
        return Response({'error': 'Missing customer name or phone number'}, status=status.HTTP_400_BAD_REQUEST)

    if Lead.objects.filter(phone_number=phone).exists():
        return Response({'status': 'duplicate', 'phone_number': phone}, status=status.HTTP_200_OK)

    agent = get_least_loaded_agent()
    lead = Lead.objects.create(
        customer_name=name,
        phone_number=phone,
        location=location or None,
        source=source or None,
        assigned_agent=agent,
    )

    return Response({
        'status': 'created',
        'lead_id': lead.id,
        'assigned_agent': agent.get_full_name() if agent else None,
    }, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAgent])
def my_leads(request):
    leads = Lead.objects.filter(assigned_agent=request.user).order_by('-created_at')
    serializer = LeadSerializer(leads, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lead_detail(request, lead_id):
    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)

    # Agents can only view their own assigned leads
    if request.user.role == 'agent' and lead.assigned_agent_id != request.user.id:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    serializer = LeadSerializer(lead)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin])
def bulk_upload_leads(request):
    file = request.FILES.get('file')
    if not file:
        return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

    filename = file.name.lower()
    rows = []

    try:
        if filename.endswith('.csv'):
            decoded = file.read().decode('utf-8-sig')
            reader = csv.DictReader(io.StringIO(decoded))
            for row in reader:
                rows.append(row)

        elif filename.endswith('.xlsx'):
            wb = openpyxl.load_workbook(file, data_only=True)
            sheet = wb.active
            headers = [str(cell.value).strip() if cell.value else '' for cell in sheet[1]]
            for row in sheet.iter_rows(min_row=2, values_only=True):
                row_dict = dict(zip(headers, row))
                rows.append(row_dict)
        else:
            return Response(
                {'error': 'Only .csv or .xlsx files are supported'},
                status=status.HTTP_400_BAD_REQUEST,
            )
    except Exception as e:
        return Response({'error': f'Failed to parse file: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

    created = []
    duplicates = []
    errors = []

    for i, row in enumerate(rows, start=2):  # row 1 is header
        name = str(row.get('Customer Name') or row.get('customer_name') or '').strip()
        phone = str(row.get('Phone Number') or row.get('phone_number') or '').strip()
        location = str(row.get('Location') or row.get('location') or '').strip()
        source = str(row.get('Source') or row.get('source') or '').strip()

        if not name or not phone:
            errors.append({'row': i, 'error': 'Missing customer name or phone number'})
            continue

        if Lead.objects.filter(phone_number=phone).exists():
            duplicates.append({'row': i, 'phone_number': phone, 'customer_name': name})
            continue

        # Auto-assign to least-loaded active agent (re-checked per row
        # so leads spread evenly even within the same batch)
        agent = get_least_loaded_agent()

        lead = Lead.objects.create(
            customer_name=name,
            phone_number=phone,
            location=location or None,
            source=source or None,
            assigned_agent=agent,
        )
        created.append(lead.id)

    return Response({
        'created_count': len(created),
        'duplicate_count': len(duplicates),
        'error_count': len(errors),
        'duplicates': duplicates,
        'errors': errors,
    }, status=status.HTTP_201_CREATED)