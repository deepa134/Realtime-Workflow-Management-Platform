from django.contrib import admin
from .models import Workflow,Task

# Register your models here.
class TaskAdmin(admin.ModelAdmin):
    list_display=('title','workflow','status','assigned_to','start_date','due_date')
    list_filter=('workflow','status','assigned_to')
    feilds=('title','workflow','status','assigned_to','start_date','due_date')
admin.site.register(Workflow)
admin.site.register(Task)