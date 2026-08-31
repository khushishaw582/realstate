from django.urls import path
from .views import dashboard_stats
from django.urls import path
from .views import health_check

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path('stats/', dashboard_stats, name='dashboard_stats'),
]