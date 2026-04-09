from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response

from .models import CaDay, CoSoDaoTao, GiaoVien, LichDay, Lop, NgayLamViec
from .serializers import (
	CaDaySerializer,
	CoSoDaoTaoSerializer,
	GiaoVienCreateSerializer,
	GiaoVienSerializer,
	LichDaySerializer,
	LopSerializer,
	NgayLamViecSerializer,
)
from .permissions import IsAdminOrStaffWrite


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
	list=extend_schema(summary="Danh sách lớp", responses={200: LopSerializer(many=True)}),
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


@extend_schema_view(
	list=extend_schema(summary="Danh sách ca ngày", responses={200: CaDaySerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết ca ngày", responses={200: CaDaySerializer}),
	create=extend_schema(summary="tạo ca ngày", request=CaDaySerializer, responses={201: CaDaySerializer}),
	update=extend_schema(summary="cập nhật ca ngày", request=CaDaySerializer, responses={200: CaDaySerializer}),
	partial_update=extend_schema(summary="cập nhật một phần ca ngày", request=CaDaySerializer, responses={200: CaDaySerializer}),
	destroy=extend_schema(summary="xóa ca ngày", responses={204: None}),
)
class CaDayViewSet(viewsets.ModelViewSet):
	queryset = CaDay.objects.all()
	serializer_class = CaDaySerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]


@extend_schema_view(
	list=extend_schema(summary="Danh sách giáo viên", responses={200: GiaoVienSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết giáo viên", responses={200: GiaoVienSerializer}),
	create=extend_schema(summary="tạo giáo viên", request=GiaoVienCreateSerializer, responses={201: GiaoVienSerializer}),
	update=extend_schema(summary="cập nhật giáo viên", request=GiaoVienSerializer, responses={200: GiaoVienSerializer}),
	partial_update=extend_schema(summary="cập nhật một phần giáo viên", request=GiaoVienSerializer, responses={200: GiaoVienSerializer}),
	destroy=extend_schema(summary="xóa giáo viên", responses={204: None}),
)
class GiaoVienViewSet(viewsets.ModelViewSet):
	queryset = GiaoVien.objects.all()
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]

	def get_serializer_class(self):
		if self.action == "create":
			return GiaoVienCreateSerializer
		return GiaoVienSerializer

	def destroy(self, request, *args, **kwargs):
		instance = self.get_object()
		instance.is_deleted = True
		instance.save(update_fields=["is_deleted"])
		return Response(status=status.HTTP_204_NO_CONTENT)


@extend_schema_view(
	list=extend_schema(summary="Danh sách lịch dạy", responses={200: LichDaySerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết lịch dạy", responses={200: LichDaySerializer}),
	create=extend_schema(summary="tạo lịch dạy", request=LichDaySerializer, responses={201: LichDaySerializer}),
	update=extend_schema(summary="cập nhật lịch dạy", request=LichDaySerializer, responses={200: LichDaySerializer}),
	partial_update=extend_schema(summary="cập nhật một phần lịch dạy", request=LichDaySerializer, responses={200: LichDaySerializer}),
	destroy=extend_schema(summary="xóa lịch dạy", responses={204: None}),
)
class LichDayViewSet(viewsets.ModelViewSet):
	queryset = LichDay.objects.all()
	serializer_class = LichDaySerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]


@extend_schema_view(
	list=extend_schema(summary="Danh sách ngày làm việc", responses={200: NgayLamViecSerializer(many=True)}),
	retrieve=extend_schema(summary="Chi tiết ngày làm việc", responses={200: NgayLamViecSerializer}),
	create=extend_schema(summary="tạo ngày làm việc", request=NgayLamViecSerializer, responses={201: NgayLamViecSerializer}),
	update=extend_schema(summary="cập nhật ngày làm việc", request=NgayLamViecSerializer, responses={200: NgayLamViecSerializer}),
	partial_update=extend_schema(summary="cập nhật một phần ngày làm việc", request=NgayLamViecSerializer, responses={200: NgayLamViecSerializer}),
	destroy=extend_schema(summary="xóa ngày làm việc", responses={204: None}),
)
class NgayLamViecViewSet(viewsets.ModelViewSet):
	queryset = NgayLamViec.objects.all()
	serializer_class = NgayLamViecSerializer
	permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAdminOrStaffWrite]
