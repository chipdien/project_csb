from rest_framework import serializers

from .models import LocalPermission, LocalRole, LocalUserRole, ServiceUser, User


class CompanyUserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = [
			"id",
			"username",
			"nickname",
			"email",
			"phone",
			"status",
		]


class ServiceUserSerializer(serializers.ModelSerializer):
	roles = serializers.SerializerMethodField()
	permissions = serializers.SerializerMethodField()

	class Meta:
		model = ServiceUser
		fields = [
			"id",
			"nocobase_user_id",
			"username",
			"email",
			"display_name",
			"phone",
			"is_active",
			"roles",
			"permissions",
		]

	def get_roles(self, obj):
		return [
			assignment.role.code
			for assignment in obj.role_assignments.select_related("role").all()
			if assignment.role.is_active
		]

	def get_permissions(self, obj):
		return sorted(
			{
				mapping.permission.code
				for assignment in obj.role_assignments.select_related("role").all()
				for mapping in assignment.role.permissions_map.select_related("permission").all()
			}
		)


class LocalRoleSerializer(serializers.ModelSerializer):
	permissions = serializers.PrimaryKeyRelatedField(
		many=True,
		write_only=True,
		queryset=LocalPermission.objects.all(),
		required=False,
	)
	permission_codes = serializers.SerializerMethodField(read_only=True)

	class Meta:
		model = LocalRole
		fields = [
			"id",
			"code",
			"name",
			"description",
			"is_active",
			"permissions",
			"permission_codes",
		]

	def get_permission_codes(self, obj):
		return [mapping.permission.code for mapping in obj.permissions_map.select_related("permission").all()]

	def create(self, validated_data):
		permissions = validated_data.pop("permissions", [])
		role = LocalRole.objects.create(**validated_data)
		self._sync_permissions(role, permissions)
		return role

	def update(self, instance, validated_data):
		permissions = validated_data.pop("permissions", None)
		for attr, value in validated_data.items():
			setattr(instance, attr, value)
		instance.save()
		if permissions is not None:
			self._sync_permissions(instance, permissions)
		return instance

	def _sync_permissions(self, role, permissions):
		role.permissions_map.all().delete()
		for permission in permissions:
			role.permissions_map.create(permission=permission)


class LocalPermissionSerializer(serializers.ModelSerializer):
	class Meta:
		model = LocalPermission
		fields = "__all__"


class LocalUserRoleSerializer(serializers.ModelSerializer):
	class Meta:
		model = LocalUserRole
		fields = ["id", "service_user", "role", "created_at"]


class TokenObtainCompanySerializer(serializers.Serializer):
	account = serializers.CharField()
	password = serializers.CharField(write_only=True)


class TokenRefreshResponseSerializer(serializers.Serializer):
	refresh = serializers.CharField()
	access = serializers.CharField()
	user = CompanyUserSerializer()
