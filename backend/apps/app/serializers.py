from rest_framework import serializers

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


class CentersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Centers
        fields = "__all__"


class EduClassesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EduClasses
        fields = "__all__"


class EduCoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = EduCourses
        fields = "__all__"


class EduDomainsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EduDomains
        fields = "__all__"


class EduSessionsSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source="teacher.name", read_only=True)
    class_code = serializers.CharField(source="edu_class.code", read_only=True)
    class_name = serializers.CharField(source="edu_class.name", read_only=True)
    class Meta:
        model = EduSessions
        fields = "id", "teacher_id", "teacher_name", "class_id", "class_code", "class_name", "date", "from_field","to", "room_id"


class EduTeachersSerializer(serializers.ModelSerializer):
    class Meta:
        model = EduTeachers
        fields = "__all__"


class EduClassConfigsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EduClassConfigs
        fields = "__all__"


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
