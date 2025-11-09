from .views import WorkflowViewSet,TaskViewSet,UserViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import login_view

router=DefaultRouter()
router.register(r'workflows',WorkflowViewSet)
router.register(r'tasks',TaskViewSet)
router.register(r'users', UserViewSet)

urlpatterns=[
    path('',include(router.urls)),
    path('login/', login_view),
]