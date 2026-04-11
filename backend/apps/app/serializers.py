from rest_framework import serializers

from .models import (
    Centers,
    EduClassConfigs,
    EduClasses,
    EduCourses,
    EduDomains,
    EduSessions,
    EduTeachers,
    Users,
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
    class Meta:
        model = EduSessions
        fields = "__all__"


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
        model = Users
        fields = "__all__"

