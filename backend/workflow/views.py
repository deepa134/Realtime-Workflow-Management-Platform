from django.contrib.auth.models import User
from django.shortcuts import render
from .serializers import WorkflowSerializer,TaskSerializer,UserSerializer
from .models import Workflow,Task
from rest_framework import viewsets
#from rest_framework_simplejwt.views import TokenObtainPairView
#from .serializers import MyTokenObtainPairSerializer
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json



@csrf_exempt
def login_view(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")

        user = authenticate(username=username, password=password)
        if user:
            login(request, user)

            #  Detect group-based role properly
            groups = list(user.groups.values_list('name', flat=True))
            if "Admin" in groups:
                role = "admin"
            elif "Manager" in groups:
                role = "manager"
            elif "Employee" in groups:
                role = "employee"
            elif user.is_superuser:
                role = "admin"
            else:
                role = "employee"

            return JsonResponse({
                "success": True,
                "role": role,
                "user_id": user.id
            })
        else:
            return JsonResponse({
                "success": False,
                "error": "Invalid username or password"
            })
    return JsonResponse({"success": False, "error": "POST request required"})


class WorkflowViewSet(viewsets.ModelViewSet):
    queryset=Workflow.objects.all()
    serializer_class=WorkflowSerializer

class TaskViewSet(viewsets.ModelViewSet):
    queryset=Task.objects.all()
    serializer_class=TaskSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer







