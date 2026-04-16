from drf_spectacular.utils import OpenApiExample, extend_schema, extend_schema_view
from rest_framework import permissions, status, viewsets
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import LocalPermission, LocalRole, LocalUserRole, ServiceUser, User
from .permissions import IsNocoBaseAdminUser
from .serializers import (
	CompanyUserSerializer,
	LocalPermissionSerializer,
	LocalRoleSerializer,
	LocalUserRoleSerializer,
	ServiceUserSerializer,
	TokenObtainCompanySerializer,
	TokenRefreshResponseSerializer,
)
from .services import LocalAccessService, NocoBaseAuthService

class CompanyTokenObtainPairView(APIView):
	permission_classes = [permissions.AllowAny]

	@extend_schema(
		summary="Dang nhap va nhan JWT token",
		request=TokenObtainCompanySerializer,
		responses={200: TokenRefreshResponseSerializer},
		auth=[],
		examples=[
			OpenApiExample(
				"Login payload",
				value={"account": "giapcn", "password": "Abc@1123"},
				request_only=True,
			),
		],
	)
	def post(self, request, *args, **kwargs):
		serializer = TokenObtainCompanySerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		account = serializer.validated_data["account"]
		password = serializer.validated_data["password"]

		signin_payload = NocoBaseAuthService.sign_in(account=account, password=password)
		profile_payload = NocoBaseAuthService.fetch_profile(signin_payload)
		user = self._get_company_user(account)

		if not user.is_active:
			raise AuthenticationFailed("This account is inactive.")

		service_user = LocalAccessService.sync_service_user(user)
		local_roles, local_permissions = LocalAccessService.get_access_payload(service_user)

		refresh = self._build_refresh_token(
			user=user,
			nocobase_roles=NocoBaseAuthService.extract_role_names(profile_payload),
			local_roles=local_roles,
			local_permissions=local_permissions,
		)
		return Response(
			{
				"refresh": str(refresh),
				"access": str(refresh.access_token),
				"user": CompanyUserSerializer(user).data,
			},
			status=status.HTTP_200_OK,
		)

	def _get_company_user(self, account: str) -> User:
		try:
			return User.objects.get(username=account)
		except User.DoesNotExist:
			try:
				return User.objects.get(email=account)
			except User.DoesNotExist as exc:
				raise AuthenticationFailed("NocoBase authenticated, but user was not found in local database.") from exc

	def _build_refresh_token(
		self,
		*,
		user: User,
		nocobase_roles: list[str],
		local_roles: list[str],
		local_permissions: list[str],
	):
		refresh = RefreshToken()
		refresh["user_id"] = user.id
		refresh["username"] = user.username
		refresh["status"] = user.status
		refresh["roles"] = nocobase_roles
		refresh["local_roles"] = local_roles
		refresh["local_permissions"] = local_permissions
		return refresh

@extend_schema_view(
	list=extend_schema(summary="Danh sách người dùng công ty", responses={200: ServiceUserSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết người dùng công ty", responses={200: ServiceUserSerializer}),
)
class UserViewSet(viewsets.ModelViewSet):
	queryset = ServiceUser.objects.prefetch_related("role_assignments__role__permissions_map__permission").all()
	permission_classes = [IsNocoBaseAdminUser]
	serializer_class = ServiceUserSerializer

@extend_schema_view(
	list=extend_schema(summary="Danh sách vai trò cục bộ", responses={200: LocalRoleSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết vai trò cục bộ", responses={200: LocalRoleSerializer}),
)
class LocalRoleViewSet(viewsets.ModelViewSet):
	queryset = LocalRole.objects.prefetch_related("permissions_map__permission").all()
	serializer_class = LocalRoleSerializer
	permission_classes = [IsNocoBaseAdminUser]

@extend_schema_view(
	list=extend_schema(summary="Danh sách quyền cục bộ", responses={200: LocalPermissionSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết quyền cục bộ", responses={200: LocalPermissionSerializer}),
)
class LocalPermissionViewSet(viewsets.ModelViewSet):
	queryset = LocalPermission.objects.all()
	serializer_class = LocalPermissionSerializer
	permission_classes = [IsNocoBaseAdminUser]

@extend_schema_view(
	list=extend_schema(summary="Danh sách vai trò cục bộ", responses={200: LocalUserRoleSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết vai trò cục bộ", responses={200: LocalUserRoleSerializer}),
)
class LocalUserRoleViewSet(viewsets.ModelViewSet):
	queryset = LocalUserRole.objects.select_related("service_user", "role").all()
	serializer_class = LocalUserRoleSerializer
	permission_classes = [IsNocoBaseAdminUser]
