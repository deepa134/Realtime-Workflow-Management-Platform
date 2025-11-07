from django.shortcuts import render
from .serializers import WorkflowSerializer,TaskSerializer
from .models import Workflow,Task
from rest_framework import viewsets

class WorkflowViewSet(viewsets.ModelViewSet):
    queryset=Workflow.objects.all()
    serializer_class=WorkflowSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset=Task.objects.all()
    serializer_class=TaskSerializer






