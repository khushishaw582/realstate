from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    status = serializers.ReadOnlyField()
    priority = serializers.ReadOnlyField()
    followup_date = serializers.ReadOnlyField()
    assigned_agent_name = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = [
            'id',
            'customer_name',
            'phone_number',
            'location',
            'source',
            'assigned_agent',
            'assigned_agent_name',
            'status',
            'priority',
            'followup_date',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['assigned_agent']

    def get_assigned_agent_name(self, obj):
        if obj.assigned_agent:
            return obj.assigned_agent.get_full_name() or obj.assigned_agent.username
        return None


class LeadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['customer_name', 'phone_number', 'location', 'source']

    def validate_phone_number(self, value):
        # FR-09: Duplicate Lead Detection is handled in the view,
        # not here, so we can return full existing-lead info on conflict.
        return value


class LeadAssignSerializer(serializers.Serializer):
    lead_ids = serializers.ListField(child=serializers.IntegerField())
    agent_id = serializers.IntegerField()