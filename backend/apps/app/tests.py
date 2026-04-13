from django.test import SimpleTestCase
from django.urls import resolve


class LegacyRouteTests(SimpleTestCase):
    def test_legacy_users_route_points_to_legacy_viewset(self):
        match = resolve("/api/users/")
        self.assertEqual(match.func.cls.__name__, "UsersViewSet")
