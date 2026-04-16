from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import LocalPermissionViewSet, LocalRoleViewSet, LocalUserRoleViewSet, UserViewSet

# Undo test comment in urls.py.
router = DefaultRouter()
router.register("users", UserViewSet, basename="user")
router.register("roles", LocalRoleViewSet, basename="local-role")
router.register("permissions", LocalPermissionViewSet, basename="local-permission")
router.register("user-roles", LocalUserRoleViewSet, basename="local-user-role")

urlpatterns = [
	path("", include(router.urls)),
]
