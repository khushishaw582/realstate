from django.db import models
from django.conf import settings
from leads.models import Lead


class LeadActivity(models.Model):
    STATUS_CHOICES = (
        ('Interested', 'Interested'),
        ('Not Interested', 'Not Interested'),
        ('No Answer', 'No Answer'),
        ('Call Back Later', 'Call Back Later'),
        ('Wrong Number', 'Wrong Number'),
    )

    PRIORITY_CHOICES = (
        ('Hot', 'Hot'),
        ('Warm', 'Warm'),
        ('Cold', 'Cold'),
    )

    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities')
    agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='activities',
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES)
    notes = models.TextField(blank=True, null=True)
    recording = models.FileField(upload_to='recordings/%Y/%m/', blank=True, null=True)

    followup_date = models.DateField(blank=True, null=True)
    followup_time = models.TimeField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.lead.customer_name} - {self.status} ({self.created_at.date()})"