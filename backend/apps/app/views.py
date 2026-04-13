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
	)
	def get(self, request):
		co_so_id = request.query_params.get("co_so_dao_tao")
		start_date_raw = request.query_params.get("start_date")
		end_date_raw = request.query_params.get("end_date")
		if not co_so_id or not start_date_raw or not end_date_raw:
			return Response(
				{
					"detail": "Require co_so_dao_tao, start_date, end_date (YYYY-MM-DD).",
				},
				status=status.HTTP_400_BAD_REQUEST,
			)

		try:
			start_date = date.fromisoformat(start_date_raw)
			end_date = date.fromisoformat(end_date_raw)
		except ValueError:
			return Response(
				{"detail": "Invalid date format. Use YYYY-MM-DD."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		if end_date < start_date:
			return Response(
				{"detail": "end_date must be >= start_date."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		days = [
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
			"sunday",
		]

		lich_days = (
			LichDay.objects.select_related(
				"giao_vien",
				"ca_day",
				"ca_day__lop",
				"ca_day__lop__co_so_dao_tao",
			)
			.filter(
				ngay_day__range=[start_date, end_date],
				ca_day__lop__co_so_dao_tao_id=co_so_id,
			)
			.order_by("ca_day__lop__khoi", "ngay_day", "ca_day__gio_bat_dau")
		)

		data_by_khoi = {}
		for item in lich_days:
			khoi = item.ca_day.lop.khoi
			if khoi not in data_by_khoi:
				data_by_khoi[khoi] = {day: [] for day in days}
			day_key = days[item.ngay_day.weekday()]
			teacher_id_raw = item.giao_vien.id if item.giao_vien else None
			teacher_code = f"T{teacher_id_raw:03d}" if teacher_id_raw else ""
			data_by_khoi[khoi][day_key].append(
				{
					"id": item.id,
					"code": item.ca_day.lop.ma_lop,
					"time": f"{_format_time(item.ca_day.gio_bat_dau)} - {_format_time(item.ca_day.gio_ket_thuc)}",
					"teacher_id": teacher_code,
					"teacher_name": item.giao_vien.ho_ten if item.giao_vien else "",
					"teacher_pk": teacher_id_raw,
					"class_id": item.ca_day.lop.id,
					"shift_id": item.ca_day.id,
					"room": item.ca_day.ten_ca,
					"subject": item.ca_day.lop.mon_hoc,
					"class_name": item.ca_day.lop.ten_lop,
				}
			)

		data = [
			{
				"khoi": f"Khối {khoi}",
				"schedule": data_by_khoi[khoi],
			}
			for khoi in sorted(data_by_khoi.keys())
		]

		return Response(
			{
				"week_range": f"{start_date:%d/%m/%Y} - {end_date:%d/%m/%Y}",
				"data": data,
			}
		)
)

@extend_schema_view(
	list=extend_schema(summary="Danh sách cơ sở đào tạo", responses={200: CoSoDaoTaoSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết cơ sở đào tạo", responses={200: CoSoDaoTaoSerializer}),
	create=extend_schema(summary="ạo cơ sở đào tạo", request=CoSoDaoTaoSerializer, responses={201: CoSoDaoTaoSerializer}),
	update=extend_schema(summary="ập nhật cơ sở đào tạo", request=CoSoDaoTaoSerializer, responses={200: CoSoDaoTaoSerializer}),
	partial_update=extend_schema(summary="ập nhật một phần cơ sở đào tạo", request=CoSoDaoTaoSerializer, responses={200: CoSoDaoTaoSerializer}),
	destroy=extend_schema(summary="xóa cơ sở đào tạo", responses={204: None}),
)
class CoSoDaoTaoViewSet(viewsets.ModelViewSet):
	queryset = CoSoDaoTao.objects.all()
	serializer_class = CoSoDaoTaoSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]


@extend_schema_view(
	list=extend_schema(
		summary="Danh sách lớp",
		parameters=[
			OpenApiParameter(
				name="khoi",
				type=OpenApiTypes.INT,
				location=OpenApiParameter.QUERY,
				required=False,
				description="Loc theo khoi (1-12).",
			),
		],
		responses={200: LopSerializer(many=True)},
	),
	retrieve=extend_schema(summary="Chi tiết lớp", responses={200: LopSerializer}),
	create=extend_schema(summary="ạo lớp", request=LopSerializer, responses={201: LopSerializer}),
	update=extend_schema(summary="ập nhật lớp", request=LopSerializer, responses={200: LopSerializer}),
	partial_update=extend_schema(summary="ập nhật một phần lớp", request=LopSerializer, responses={200: LopSerializer}),
	destroy=extend_schema(summary="xóa lớp", responses={204: None}),
)
class LopViewSet(viewsets.ModelViewSet):
	queryset = Lop.objects.all()
	serializer_class = LopSerializer
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
