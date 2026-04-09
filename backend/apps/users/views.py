from rest_framework import permissions, viewsets

from .models import User
from .serializers import UserAdminSerializer, UserSerializer


class UserViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	permission_classes = [permissions.IsAdminUser]

	def get_serializer_class(self):
		if self.action in {"list", "retrieve"}:
			return UserSerializer
		return UserAdminSerializer
