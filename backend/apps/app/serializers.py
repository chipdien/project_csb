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
    teacher_name = serializers.SerializerMethodField(read_only=True)
    class_code = serializers.SerializerMethodField(read_only=True)
    class_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = EduSessions
        fields = (
            "id",
            "teacher_id",
            "teacher_name",
            "class_id",
            "class_code",
            "class_name",
            "date",
            "from_field",
            "to",
            "room_id",
        )

    def get_teacher_name(self, obj):
        teacher = EduTeachers.objects.filter(id=obj.teacher_id).first()
        return teacher.name if teacher else None

    def get_class_code(self, obj):
        class_config = EduClasses.objects.filter(id=obj.class_id).first()
        return class_config.code if class_config else None

    def get_class_name(self, obj):
        class_config = EduClasses.objects.filter(id=obj.class_id).first()
        return class_config.name if class_config else None


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
