from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from workflow.models import Task, Workflow
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = "create roles and assign permissions"

    def handle(self, *args, **kwargs):
        # Create groups
        admin_group, _ = Group.objects.get_or_create(name="Admin")
        manager_group, _ = Group.objects.get_or_create(name="Manager")
        employee_group, _ = Group.objects.get_or_create(name="Employee")

        # Content types
        task_ct = ContentType.objects.get_for_model(Task)
        workflow_ct = ContentType.objects.get_for_model(Workflow)

        # Permissions
        task_perms = Permission.objects.filter(content_type=task_ct)
        workflow_perms = Permission.objects.filter(content_type=workflow_ct)

        admin_group.permissions.set(list(task_perms) + list(workflow_perms))

        manager_task_perms = Permission.objects.filter(content_type=task_ct, codename__in=['add_task','change_task','view_task'])
        manager_workflow_perms = Permission.objects.filter(content_type=workflow_ct, codename__in=['view_workflow'])
        manager_group.permissions.set(list(manager_task_perms) + list(manager_workflow_perms))

        employee_group_perms = Permission.objects.filter(content_type=task_ct, codename__in=['view_task'])
        employee_group.permissions.set(employee_group_perms)

        # Users to create
        users = [
            ('mani', 'Admin', True, 'password123'),
            ('ritu', 'Manager', False, 'password123'),
            ('sanju', 'Manager', False, 'password123'),
            ('alice', 'Employee', False, 'password123'),
            ('bob', 'Employee', False, 'password123'),
        ]

        for username, group_name, is_superuser, pwd in users:
            user, created = User.objects.get_or_create(
                username=username,
                defaults={'is_staff': True, 'is_superuser': is_superuser}
            )
            if created:
                user.set_password(pwd)
                user.save()

            group = Group.objects.get(name=group_name)
            if not user.groups.filter(name=group_name).exists():
                user.groups.add(group)
                user.save()

        self.stdout.write(self.style.SUCCESS("Roles, permissions, and users created successfully!"))
