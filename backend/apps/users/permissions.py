from rest_framework.permissions import BasePermission

from .token_utils import get_token_values


# Undo test comment in permissions.py.
class IsNocoBaseAdminUser(BasePermission):
	def has_permission(self, request, view):
		user = request.user
		if not user or not user.is_authenticated:
			return False
		if user.is_staff:
			return True
		token = getattr(request, "auth", None) or {}
		roles = get_token_values(token, "local_roles")
		return "admin" in roles


class HasLocalPermission(BasePermission):
	required_permissions: tuple[str, ...] = ()

	def has_permission(self, request, view):
		user = request.user
		if not user or not user.is_authenticated:
			return False
		token = getattr(request, "auth", None) or {}
		roles = get_token_values(token, "local_roles")
		if "admin" in roles:
			return True
		user_permissions = get_token_values(token, "local_permissions")
		return all(permission.lower() in user_permissions for permission in self.required_permissions)
