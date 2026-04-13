from __future__ import annotations

from typing import Any

from django.contrib.auth.hashers import check_password, identify_hasher, make_password
from django.db import models


class UserManager(models.Manager):
	def _normalize_role(self, extra_fields: dict[str, Any]) -> dict[str, Any]:
		role = extra_fields.pop("role", None)
		if role and not extra_fields.get("status"):
			extra_fields["status"] = role
		return extra_fields

	def create_user(self, username: str, email: str | None = None, password: str | None = None, **extra_fields):
		if not username:
			raise ValueError("The username field is required.")

		extra_fields = self._normalize_role(extra_fields)
		user = self.model(username=username, email=email, **extra_fields)
		if password:
			user.set_password(password)
		user.save(using=self._db)
		return user


class User(models.Model):
	id = models.BigAutoField(primary_key=True)
	created_at = models.DateTimeField(blank=True, null=True)
	updated_at = models.DateTimeField(blank=True, null=True)
	nickname = models.CharField(max_length=255, blank=True, null=True)
	username = models.CharField(unique=True, max_length=255)
	email = models.CharField(unique=True, max_length=255, blank=True, null=True)
	phone = models.CharField(unique=True, max_length=255, blank=True, null=True)
	password = models.CharField(max_length=255, blank=True, null=True)
	password_change_tz = models.BigIntegerField(blank=True, null=True)
	app_lang = models.CharField(max_length=255, blank=True, null=True)
	reset_token = models.CharField(unique=True, max_length=255, blank=True, null=True)
	system_settings = models.JSONField(blank=True, null=True)
	sort = models.BigIntegerField(blank=True, null=True)
	created_by_id = models.BigIntegerField(blank=True, null=True)
	updated_by_id = models.BigIntegerField(blank=True, null=True)
	teacher_id = models.BigIntegerField(blank=True, null=True)
	status = models.CharField(max_length=255, blank=True, null=True)
	opt_school_year = models.CharField(max_length=255, blank=True, null=True)
	level_rank = models.FloatField(blank=True, null=True)
	login_token = models.CharField(unique=True, max_length=255, blank=True, null=True)
	login_token_expires_at = models.DateTimeField(blank=True, null=True)
	portal_password = models.CharField(max_length=255, blank=True, null=True)
	opt_class_id = models.BigIntegerField(blank=True, null=True)
	opt_student_id = models.BigIntegerField(blank=True, null=True)
	main_department_id = models.BigIntegerField(blank=True, null=True)

	objects = UserManager()

	class Meta:
		db_table = "users"
		managed = False

	def __str__(self) -> str:
		return self.username

	def get_role_names(self) -> set[str]:
		token_roles = getattr(self, "token_roles", None) or []
		local_roles = getattr(self, "local_roles", None) or []
		role_names = {str(role).lower() for role in token_roles if role}
		role_names.update(str(role).lower() for role in local_roles if role)
		if self.status:
			role_names.add(str(self.status).lower())
		return role_names

	@property
	def is_authenticated(self) -> bool:
		return True

	@property
	def is_anonymous(self) -> bool:
		return False

	@property
	def is_active(self) -> bool:
		return self.status not in {"inactive", "disabled", "locked"}

	@property
	def is_staff(self) -> bool:
		return bool(self.get_role_names() & {"admin", "staff"})

	@property
	def is_superuser(self) -> bool:
		return "admin" in self.get_role_names()

	def set_password(self, raw_password: str) -> None:
		self.password = make_password(raw_password)

	def set_unusable_password(self) -> None:
		self.password = "!"

	def check_password(self, raw_password: str) -> bool:
		stored_password = self.password or ""
		if not stored_password:
			return False
		if stored_password == raw_password:
			return True
		try:
			if check_password(raw_password, stored_password):
				return True
		except ValueError:
			pass
		if stored_password.startswith("$2y$"):
			try:
				return check_password(raw_password, "$2b$" + stored_password[4:])
			except ValueError:
				return False
		try:
			identify_hasher(stored_password)
		except ValueError:
			return False
		return False

	def has_perm(self, perm: str, obj=None) -> bool:
		if self.is_superuser:
			return True
		local_permissions = {
			str(code).lower()
			for code in (getattr(self, "local_permissions", None) or [])
			if code
		}
		return perm.lower() in local_permissions

	def has_module_perms(self, app_label: str) -> bool:
		if self.is_superuser:
			return True
		return bool(getattr(self, "local_roles", None))

	@property
	def phone_number(self) -> str:
		return self.phone or ""

	@phone_number.setter
	def phone_number(self, value: str) -> None:
		self.phone = value

	@property
	def role(self) -> str:
		role_names = self.get_role_names()
		if "admin" in role_names:
			return "admin"
		if "center_manager" in role_names:
			return "center_manager"
		if "teacher" in role_names:
			return "teacher"
		if "staff" in role_names:
			return "staff"
		return self.status or "teacher"

	@role.setter
	def role(self, value: str) -> None:
		self.status = value


class ServiceUser(models.Model):
	nocobase_user_id = models.BigIntegerField(unique=True)
	username = models.CharField(max_length=255, unique=True)
	email = models.CharField(max_length=255, blank=True)
	display_name = models.CharField(max_length=255, blank=True)
	phone = models.CharField(max_length=255, blank=True)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = "service_users"

	def __str__(self) -> str:
		return self.username


class LocalRole(models.Model):
	code = models.CharField(max_length=100, unique=True)
	name = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	is_active = models.BooleanField(default=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = "local_roles"

	def __str__(self) -> str:
		return self.name


class LocalPermission(models.Model):
	code = models.CharField(max_length=100, unique=True)
	name = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		db_table = "local_permissions"

	def __str__(self) -> str:
		return self.name


class LocalRolePermission(models.Model):
	role = models.ForeignKey(LocalRole, on_delete=models.CASCADE, related_name="permissions_map")
	permission = models.ForeignKey(LocalPermission, on_delete=models.CASCADE, related_name="roles_map")
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = "local_role_permissions"
		unique_together = ("role", "permission")


class LocalUserRole(models.Model):
	service_user = models.ForeignKey(ServiceUser, on_delete=models.CASCADE, related_name="role_assignments")
	role = models.ForeignKey(LocalRole, on_delete=models.CASCADE, related_name="user_assignments")
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		db_table = "local_user_roles"
		unique_together = ("service_user", "role")
