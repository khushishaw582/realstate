from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings


class Lead(models.Model):
    customer_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, unique=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    source = models.CharField(max_length=255, blank=True, null=True)

    assigned_agent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_leads',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.customer_name} ({self.phone_number})"

    @property
    def latest_activity(self):
        return self.activities.order_by('-created_at').first()

    @property
    def status(self):
        activity = self.latest_activity
        return activity.status if activity else None

    @property
    def priority(self):
        activity = self.latest_activity
        return activity.priority if activity else None

    @property
    def followup_date(self):
        activity = self.latest_activity
        return activity.followup_date if activity else None