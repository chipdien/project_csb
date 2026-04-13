from django.test import SimpleTestCase
from django.urls import resolve
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate

from .models import User
from .views import UserViewSet


class AdminUserRouteTests(SimpleTestCase):
    def test_admin_users_route_points_to_custom_user_viewset(self):
        match = resolve("/api/admin/users/")
        self.assertEqual(match.func.cls.__name__, "UserViewSet")

    def test_non_admin_cannot_list_admin_users(self):
        user = User(
            username="teacher1",
            email="teacher1@example.com",
            status="teacher",
        )
        factory = APIRequestFactory()
        request = factory.get("/api/admin/users/")
        force_authenticate(request, user=user)
        view = UserViewSet.as_view({"get": "list"})

        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
