from django.urls import path
from .views import list_agents

urlpatterns = [
    path('agents/', list_agents, name='list_agents'),
]