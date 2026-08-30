from rest_framework import serializers
from .models import LeadActivity


class LeadActivitySerializer(serializers.ModelSerializer):
    agent_name = serializers.SerializerMethodField()

    class Meta:
        model = LeadActivity
        fields = [
            'id',
            'lead',
            'agent',
            'agent_name',
            'status',
            'priority',
            'notes',
            'recording',
            'followup_date',
            'followup_time',
            'created_at',
        ]
        read_only_fields = ['agent', 'lead']

    def get_agent_name(self, obj):
        if obj.agent:
            return obj.agent.get_full_name() or obj.agent.username
        return None


class LeadActivityCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeadActivity
        fields = ['status', 'priority', 'notes', 'recording', 'followup_date', 'followup_time']

    def validate(self, data):
        if data.get('status') == 'Call Back Later':
            if not data.get('followup_date') or not data.get('followup_time'):
                raise serializers.ValidationError(
                    'Follow-up date and time are required when status is "Call Back Later"'
                )
        return data