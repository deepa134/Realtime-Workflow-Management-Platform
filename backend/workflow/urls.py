from .views import WorkflowViewSet,TaskViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path,include

router=DefaultRouter()
router.register(r'workflows',WorkflowViewSet)
router.register(r'tasks',TaskViewSet)

urlpatterns=[
    path('',include(router.urls)),
]