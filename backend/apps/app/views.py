from datetime import date

from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema, extend_schema_view
from rest_framework import permissions, viewsets
from rest_framework.exceptions import ValidationError

from apps.users.models import User
from .models import (
	Centers,
	EduClassConfigs,
	EduClasses,
	EduCourses,
	EduDomains,
	EduSessions,
	EduTeachers,
)
from .serializers import (
	CentersSerializer,
	EduClassConfigsSerializer,
	EduClassesSerializer,
	EduCoursesSerializer,
	EduDomainsSerializer,
	EduSessionsSerializer,
	EduTeachersSerializer,
	UsersSerializer,
)
from .permissions import IsAdminOrStaffWrite


@extend_schema_view(
	list=extend_schema(summary="Danh sách trung tâm", responses={200: CentersSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết trung tâm", responses={200: CentersSerializer}),
)
class CentersViewSet(viewsets.ModelViewSet):
	queryset = Centers.objects.all()
	serializer_class = CentersSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]
	http_method_names = ["get", "head", "options"]


@extend_schema_view(
	list=extend_schema(summary="Danh sách lớp", responses={200: EduClassesSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết lớp", responses={200: EduClassesSerializer}),
)
class EduClassesViewSet(viewsets.ModelViewSet):
	queryset = EduClasses.objects.all()
	serializer_class = EduClassesSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]
	http_method_names = ["get", "head", "options"]


@extend_schema_view(
	list=extend_schema(summary="Danh sách khóa học", responses={200: EduCoursesSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết khóa học", responses={200: EduCoursesSerializer}),
)
class EduCoursesViewSet(viewsets.ModelViewSet):
	queryset = EduCourses.objects.all()
	serializer_class = EduCoursesSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]
	http_method_names = ["get", "head", "options"]


@extend_schema_view(
	list=extend_schema(summary="Danh sách lĩnh vực", responses={200: EduDomainsSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết lĩnh vực", responses={200: EduDomainsSerializer}),
)
class EduDomainsViewSet(viewsets.ModelViewSet):
	queryset = EduDomains.objects.all()
	serializer_class = EduDomainsSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]
	http_method_names = ["get", "head", "options"]


@extend_schema_view(
	list=extend_schema(
		summary="Danh sách buổi học",
		parameters=[
			OpenApiParameter(
				name="center_id",
				type=OpenApiTypes.INT,
				location=OpenApiParameter.QUERY,
				required=False,
				description="Loc theo center_id.",
			),
			OpenApiParameter(
				name="start_date",
				type=OpenApiTypes.DATE,
				location=OpenApiParameter.QUERY,
				required=True,
				description="Ngay bat dau (YYYY-MM-DD).",
			),
			OpenApiParameter(
				name="end_date",
				type=OpenApiTypes.DATE,
				location=OpenApiParameter.QUERY,
				required=True,
				description="Ngay ket thuc (YYYY-MM-DD).",
			),
		],
		responses={200: EduSessionsSerializer(many=True)},
	),
	retrieve=extend_schema(summary="Chi tiết buổi học", responses={200: EduSessionsSerializer}),
)
class EduSessionsViewSet(viewsets.ModelViewSet):
	queryset = EduSessions.objects.all()
	serializer_class = EduSessionsSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]
	http_method_names = ["get", "head", "options"]

	def get_queryset(self):
		queryset = super().get_queryset()
		if self.action != "list":
			return queryset
		start_date_raw = self.request.query_params.get("start_date")
		end_date_raw = self.request.query_params.get("end_date")
		center_id_raw = self.request.query_params.get("center_id")
		if not start_date_raw or not end_date_raw:
			raise ValidationError("start_date and end_date are required (YYYY-MM-DD).")
		try:
			start_date = date.fromisoformat(start_date_raw)
			end_date = date.fromisoformat(end_date_raw)
		except ValueError as exc:
			raise ValidationError("Invalid date format. Use YYYY-MM-DD.") from exc
		if end_date < start_date:
			raise ValidationError("end_date must be >= start_date.")
		queryset = queryset.filter(date__range=[start_date, end_date])
		if center_id_raw:
			try:
				center_id = int(center_id_raw)
			except ValueError as exc:
				raise ValidationError("center_id must be an integer.") from exc
			queryset = queryset.filter(center_id=center_id)
		else:
			raise ValidationError("center_id is required.")
		return queryset


@extend_schema_view(
	list=extend_schema(summary="Danh sách giáo viên", responses={200: EduTeachersSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết giáo viên", responses={200: EduTeachersSerializer}),
)
class EduTeachersViewSet(viewsets.ModelViewSet):
	queryset = EduTeachers.objects.all()
	serializer_class = EduTeachersSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]
	http_method_names = ["get", "head", "options"]


@extend_schema_view(
	list=extend_schema(summary="Danh sách cấu hình lớp", responses={200: EduClassConfigsSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết cấu hình lớp", responses={200: EduClassConfigsSerializer}),
)
class EduClassConfigsViewSet(viewsets.ModelViewSet):
	queryset = EduClassConfigs.objects.all()
	serializer_class = EduClassConfigsSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]
	http_method_names = ["get", "head", "options"]


@extend_schema_view(
	list=extend_schema(summary="Danh sách người dùng", responses={200: UsersSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết người dùng", responses={200: UsersSerializer}),
)
class UsersViewSet(viewsets.ModelViewSet):
	queryset = User.objects.all()
	serializer_class = UsersSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]
	http_method_names = ["get", "head", "options"]