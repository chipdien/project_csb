from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class CoSoDaoTao(models.Model):
	ten_co_so = models.CharField(max_length=255)

	def __str__(self) -> str:
		return self.ten_co_so


class Lop(models.Model):
	TRANG_THAI_CHOICES = [
		("dang_mo", "Dang mo"),
		("dang_hoc", "Dang hoc"),
		("tam_dung", "Tam dung"),
		("da_ket_thuc", "Da ket thuc"),
	]

	ma_lop = models.CharField(max_length=50, unique=True)
	mon_hoc = models.CharField(max_length=255)
	ten_lop = models.CharField(max_length=255)
	khoi = models.PositiveSmallIntegerField(
		validators=[MinValueValidator(1), MaxValueValidator(12)],
	)
	ngay_bat_dau = models.DateField()
	ngay_ket_thuc = models.DateField()
	trang_thai = models.CharField(
		max_length=50,
		choices=TRANG_THAI_CHOICES,
		default="dang_mo",
	)
	mo_ta = models.TextField(blank=True)
	co_so_dao_tao = models.ForeignKey(
		CoSoDaoTao,
		on_delete=models.CASCADE,
		related_name="lops",
	)

	def __str__(self) -> str:
		return f"{self.ten_lop} ({self.ma_lop})"


class CaDay(models.Model):
	lop = models.ForeignKey(Lop, on_delete=models.CASCADE, related_name="ca_days")
	ten_ca = models.CharField(max_length=20)
	gio_bat_dau = models.TimeField()
	gio_ket_thuc = models.TimeField()

	def __str__(self) -> str:
		return f"{self.ten_ca} - {self.lop.ma_lop}"


class GiaoVien(models.Model):
	ho_ten = models.CharField(max_length=255)
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
		related_name="giao_vien",
	)
	is_deleted = models.BooleanField(default=False)

	def __str__(self) -> str:
		return self.ho_ten


class LichDay(models.Model):
	ngay_day = models.DateField()
	giao_vien = models.ForeignKey(
		GiaoVien,
		on_delete=models.CASCADE,
		related_name="lich_days",
	)
	ca_day = models.ForeignKey(
		CaDay,
		on_delete=models.CASCADE,
		related_name="lich_days",
	)

	def __str__(self) -> str:
		return f"{self.ngay_day} - {self.giao_vien.ho_ten}"


class NgayLamViec(models.Model):
	giao_vien = models.ForeignKey(
		GiaoVien,
		on_delete=models.CASCADE,
		related_name="ngay_lam_viecs",
	)
	ngay_co_the = models.DateField()
	gio_bat_dau = models.TimeField()
	gio_ket_thuc = models.TimeField()

	def __str__(self) -> str:
		return f"{self.giao_vien.ho_ten} - {self.ngay_co_the}"


