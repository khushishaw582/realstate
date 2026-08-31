from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from users.permissions import IsAdmin
from users.models import User
from leads.models import Lead
from activities.models import LeadActivity
from django.http import JsonResponse


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdmin])
def dashboard_stats(request):
    all_leads = Lead.objects.all()
    total_leads = all_leads.count()

    # Compute current status/priority per lead using latest activity
    hot_leads = warm_leads = cold_leads = 0
    active_leads = 0
    follow_ups_pending = 0

    for lead in all_leads:
        latest = lead.latest_activity
        if latest:
            active_leads += 1
            if latest.priority == 'Hot':
                hot_leads += 1
            elif latest.priority == 'Warm':
                warm_leads += 1
            elif latest.priority == 'Cold':
                cold_leads += 1
            if latest.followup_date:
                follow_ups_pending += 1

    total_calls = LeadActivity.objects.count()
    interested = LeadActivity.objects.filter(status='Interested').count()
    no_answer = LeadActivity.objects.filter(status='No Answer').count()

    lead_stats = {
        'totalLeads': total_leads,
        'activeLeads': active_leads,
        'hotLeads': hot_leads,
        'warmLeads': warm_leads,
        'coldLeads': cold_leads,
        'totalCalls': total_calls,
        'interested': interested,
        'noAnswer': no_answer,
        'followUpsPending': follow_ups_pending,
    }

    # Per-agent performance (FR-11 Agent Statistics)
    agents = User.objects.filter(role='agent', is_active=True)
    agent_stats = []
    for agent in agents:
        leads_assigned = Lead.objects.filter(assigned_agent=agent).count()
        leads_updated = LeadActivity.objects.filter(agent=agent).values('lead').distinct().count()
        follow_ups_due = LeadActivity.objects.filter(
            agent=agent, followup_date__isnull=False
        ).values('lead').distinct().count()

        agent_stats.append({
            'id': agent.id,
            'name': agent.get_full_name() or agent.username,
            'leadsAssigned': leads_assigned,
            'leadsUpdated': leads_updated,
            'followUpsDue': follow_ups_due,
        })

    return Response({
        'leadStats': lead_stats,
        'agentStats': agent_stats,
    })

def health_check(request):
    return JsonResponse({
        "status": "OK",
        "message": "Your API is running",
        "timestamp": timezone.now().isoformat(),
    })