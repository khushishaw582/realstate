from django.urls import path
from . import views
from activities.views import lead_activities
from .views import bulk_upload_leads
from .views import leads_webhook

urlpatterns = [
    path('', views.leads_list_create, name='leads_list_create'),
    path('unassigned/', views.unassigned_leads, name='unassigned_leads'),
    path('assign/', views.assign_leads, name='assign_leads'),
    path('my/', views.my_leads, name='my_leads'),
    path('<int:lead_id>/', views.lead_detail, name='lead_detail'),
    path('<int:lead_id>/activities/', lead_activities, name='lead_activities'),
    path('bulk-upload/', bulk_upload_leads, name='bulk_upload_leads'),
    path('webhook/', leads_webhook, name='leads_webhook'),
]