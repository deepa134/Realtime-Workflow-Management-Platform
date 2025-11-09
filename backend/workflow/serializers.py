from rest_framework import serializers
from .models import Workflow, Task
from django.contrib.auth.models import User

class WorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workflow
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TaskSerializer(serializers.ModelSerializer):
    # Make these writable using PrimaryKeyRelatedField
    workflow = serializers.PrimaryKeyRelatedField(queryset=Workflow.objects.all())
    assigned_to = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = Task
        fields = '__all__'

    # Return nested objects for display
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['workflow'] = WorkflowSerializer(instance.workflow).data
        ret['assigned_to'] = UserSerializer(instance.assigned_to).data if instance.assigned_to else None
        return ret
