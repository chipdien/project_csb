from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    CentersViewSet,
    EduClassConfigsViewSet,
    EduClassesViewSet,
    EduCoursesViewSet,
    EduDomainsViewSet,
    EduSessionsViewSet,
    EduTeachersViewSet,
    UsersViewSet,
)

router = DefaultRouter()
router.register("centers", CentersViewSet)
router.register("edu-classes", EduClassesViewSet)
router.register("edu-courses", EduCoursesViewSet)
router.register("edu-domains", EduDomainsViewSet)
router.register("edu-sessions", EduSessionsViewSet)
router.register("edu-teachers", EduTeachersViewSet)
router.register("edu-class-configs", EduClassConfigsViewSet)
router.register("users", UsersViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
