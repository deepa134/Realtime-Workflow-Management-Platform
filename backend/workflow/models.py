from django.db import models
from django.contrib.auth.models import User
#from django.contrib.auth.models import AbstractUser
from django.db import models



class Workflow(models.Model):
    name=models.CharField(max_length=255)
    description=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.name

class Task(models.Model):
    workflow=models.ForeignKey(Workflow,on_delete=models.CASCADE,related_name='tasks')
    title=models.CharField(max_length=255)
    status=models.CharField(max_length=50,default='pending')
    created_at=models.DateTimeField(auto_now_add=True)
    assigned_to=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,blank=True,related_name='tasks_assigned')
    start_date=models.DateTimeField(null=True)
    due_date=models.DateTimeField(null=True)
    def __str__(self):
        return self.title
