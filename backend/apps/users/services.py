import json
from urllib import error, request

from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed

from .models import ServiceUser, User


class NocoBaseAuthService:
	@classmethod
	def sign_in(cls, *, account: str, password: str) -> dict:
		payload = cls._post_json(
			settings.NOCOBASE_SIGNIN_URL,
			payload={"account": account, "password": password},
		)
		return payload

	@classmethod
	def fetch_profile(cls, signin_payload: dict) -> dict:
		token = signin_payload.get("data", {}).get("token")
		if not token:
			return {}
		return cls._get_json(
			settings.NOCOBASE_CHECK_URL,
			headers={"Authorization": f"Bearer {token}"},
			http_error_message="Could not fetch NocoBase roles.",
			connection_error_message="Could not reach NocoBase profile service.",
		)

	@staticmethod
	def extract_role_names(profile_payload: dict) -> list[str]:
		data = profile_payload.get("data", {})
		roles = data.get("roles", [])
		if not roles:
			user_data = data.get("user", {})
			roles = user_data.get("roles", []) if isinstance(user_data, dict) else []
		return [
			role.get("name", "").lower()
			for role in roles
			if isinstance(role, dict) and role.get("name")
		]

	@classmethod
	def _post_json(cls, url: str, *, payload: dict) -> dict:
		headers = {
			"Content-Type": "application/json",
			"Accept": "application/json",
		}
		authenticator = getattr(settings, "NOCOBASE_AUTHENTICATOR", "")
		if authenticator:
			headers["X-Authenticator"] = authenticator
		req = request.Request(
			url,
			data=json.dumps(payload).encode("utf-8"),
			headers=headers,
			method="POST",
		)
		return cls._open_json(
			req,
			http_error_message="Invalid username or password.",
			connection_error_message="Could not reach NocoBase authentication service.",
		)

	@classmethod
	def _get_json(cls, url: str, *, headers: dict, http_error_message: str, connection_error_message: str) -> dict:
		req = request.Request(
			url,
			headers={"Accept": "application/json", **headers},
			method="GET",
		)
		return cls._open_json(
			req,
			http_error_message=http_error_message,
			connection_error_message=connection_error_message,
		)

	@staticmethod
	def _open_json(req: request.Request, *, http_error_message: str, connection_error_message: str) -> dict:
		try:
			with request.urlopen(req, timeout=settings.NOCOBASE_TIMEOUT_SECONDS) as resp:
				if resp.status >= 400:
					raise AuthenticationFailed(http_error_message)
				body = resp.read().decode("utf-8", errors="ignore")
				return json.loads(body) if body else {}
		except error.HTTPError as exc:
			detail = exc.read().decode("utf-8", errors="ignore")
			raise AuthenticationFailed(detail or http_error_message) from exc
		except error.URLError as exc:
			raise AuthenticationFailed(connection_error_message) from exc


class LocalAccessService:
	@staticmethod
	def sync_service_user(user: User) -> ServiceUser:
		service_user, _ = ServiceUser.objects.update_or_create(
			nocobase_user_id=user.id,
			defaults={
				"username": user.username,
				"email": user.email or "",
				"display_name": user.nickname or "",
				"phone": user.phone or "",
				"is_active": user.is_active,
			},
		)
		return service_user

	@staticmethod
	def get_access_payload(service_user: ServiceUser) -> tuple[list[str], list[str]]:
		assignments = list(
			service_user.role_assignments.select_related("role").prefetch_related("role__permissions_map__permission")
		)
		role_codes = sorted(
			{
				assignment.role.code.lower()
				for assignment in assignments
				if assignment.role.is_active
			}
		)
		permission_codes = sorted(
			{
				mapping.permission.code.lower()
				for assignment in assignments
				if assignment.role.is_active
				for mapping in assignment.role.permissions_map.all()
			}
		)
		return role_codes, permission_codes
