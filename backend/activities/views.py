from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from leads.models import Lead
from .models import LeadActivity
from .serializers import LeadActivitySerializer, LeadActivityCreateSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def lead_activities(request, lead_id):
    try:
        lead = Lead.objects.get(id=lead_id)
    except Lead.DoesNotExist:
        return Response({'error': 'Lead not found'}, status=status.HTTP_404_NOT_FOUND)

    # Agents can only interact with their own assigned leads
    if request.user.role == 'agent' and lead.assigned_agent_id != request.user.id:
        return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        # FR-10: Lead Timeline
        activities = lead.activities.all()
        serializer = LeadActivitySerializer(activities, many=True)
        return Response(serializer.data)

    # POST — FR-06/07/08: Call Status, Priority, Follow-Up
    serializer = LeadActivityCreateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    activity = serializer.save(lead=lead, agent=request.user)
    return Response(
        LeadActivitySerializer(activity).data,
        status=status.HTTP_201_CREATED,
    )