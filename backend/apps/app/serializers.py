from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from .models import CaDay, CoSoDaoTao, GiaoVien, LichDay, Lop, NgayLamViec

User = get_user_model()


class CoSoDaoTaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoSoDaoTao
        fields = ["id", "ten_co_so"]


class LopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lop
        fields = [
            "id",
            "ma_lop",
            "mon_hoc",
            "ten_lop",
            "khoi",
            "ngay_bat_dau",
            "ngay_ket_thuc",
            "trang_thai",
            "mo_ta",
            "co_so_dao_tao",
        ]


class CaDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaDay
        fields = ["id", "lop", "ten_ca", "gio_bat_dau", "gio_ket_thuc"]


class GiaoVienSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiaoVien
        fields = ["id", "ho_ten", "user", "is_deleted"]


class GiaoVienUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password", "phone_number"]


class GiaoVienCreateSerializer(serializers.ModelSerializer):
    user = GiaoVienUserCreateSerializer()

    class Meta:
        model = GiaoVien
        fields = ["id", "ho_ten", "user", "is_deleted"]
        read_only_fields = ["is_deleted"]

    @transaction.atomic
    def create(self, validated_data):
        user_data = validated_data.pop("user")
        password = user_data.pop("password")
        user = User(**user_data)
        user.set_password(password)
        user.role = "teacher"
        user.save()
        giao_vien = GiaoVien.objects.create(user=user, **validated_data)
        return giao_vien


class LichDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = LichDay
        fields = ["id", "ngay_day", "giao_vien", "ca_day"]


class NgayLamViecSerializer(serializers.ModelSerializer):
    class Meta:
        model = NgayLamViec
        fields = [
            "id",
            "giao_vien",
            "ngay_co_the",
            "gio_bat_dau",
            "gio_ket_thuc",
        ]

