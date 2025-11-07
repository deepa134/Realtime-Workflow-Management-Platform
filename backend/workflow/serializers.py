from rest_framework  import serializers
from .models import Workflow,Task
from django.contrib.auth.models import User

class WorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model=Workflow
        fields='__all__'
class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model=Task
        fields='__all__'
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['id','username','email']