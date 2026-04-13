from rest_framework.permissions import BasePermission, SAFE_METHODS

from apps.users.token_utils import get_token_values


class IsAdminOrStaffWrite(BasePermission):
	def has_permission(self, request, view):
		if request.method in SAFE_METHODS:
			return True
		user = request.user
		if not user or not user.is_authenticated:
			return False
		token = getattr(request, "auth", None) or {}
		local_roles = get_token_values(token, "local_roles")
		local_permissions = get_token_values(token, "local_permissions")
		if "admin" in local_roles or "center_manager" in local_roles:
			return True
		if {"teacher.manage", "schedule.manage"} & local_permissions:
			return True
		return False
