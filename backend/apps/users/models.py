from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
	ROLE_CHOICES = [
		("admin", "Admin"),
		("teacher", "Teacher"),
		("staff", "Staff"),
	]

	email = models.EmailField(unique=True)
	phone_number = models.CharField(max_length=20, blank=True)
	role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="staff")

	def __str__(self) -> str:
		return self.get_username()
