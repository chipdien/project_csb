from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CaDayViewSet,
    CoSoDaoTaoViewSet,
    GiaoVienViewSet,
    LichDayViewSet,
    LopViewSet,
    NgayLamViecViewSet,
    ScheduleByCoSoView,
)

router = DefaultRouter()
router.register("co-so-dao-tao", CoSoDaoTaoViewSet)
router.register("lop", LopViewSet)
router.register("ca-day", CaDayViewSet)
router.register("giao-vien", GiaoVienViewSet)
router.register("lich-day", LichDayViewSet)
router.register("ngay-lam-viec", NgayLamViecViewSet)

urlpatterns = [
    path("schedule/", ScheduleByCoSoView.as_view(), name="schedule-by-co-so"),
    path("", include(router.urls)),
]
