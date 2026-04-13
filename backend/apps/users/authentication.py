from rest_framework import exceptions
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import UntypedToken

from .models import User


class CompanyJWTAuthentication(BaseAuthentication):
	www_authenticate_realm = "api"

	def authenticate(self, request):
		header = get_authorization_header(request).split()
		if not header or header[0].lower() != b"bearer":
			return None
		if len(header) != 2:
			raise exceptions.AuthenticationFailed("Invalid Authorization header.")

		raw_token = header[1]
		try:
			validated_token = UntypedToken(raw_token)
		except TokenError as exc:
			raise InvalidToken(exc.args[0]) from exc

		user_id = validated_token.get(api_settings.USER_ID_CLAIM)
		if user_id is None:
			raise exceptions.AuthenticationFailed("Token contained no recognizable user identifier.")

		try:
			user = User.objects.get(pk=user_id)
		except User.DoesNotExist as exc:
			raise exceptions.AuthenticationFailed("User not found.") from exc

		user.token_roles = validated_token.get("roles", [])
		user.local_roles = validated_token.get("local_roles", [])
		user.local_permissions = validated_token.get("local_permissions", [])

		if not user.is_active:
			raise exceptions.AuthenticationFailed("User is inactive.")

		return (user, validated_token)

	def authenticate_header(self, request):
		return f'Bearer realm="{self.www_authenticate_realm}"'
