from datetime import date, datetime, timedelta
import random

from django.core.management.base import BaseCommand

from apps.app.models import CaDay, CoSoDaoTao, GiaoVien, LichDay, Lop, NgayLamViec
from apps.users.models import User


class Command(BaseCommand):
	help = "Seed sample data for training centers, classes, schedules, and teachers."

	def add_arguments(self, parser):
		parser.add_argument("--reset", action="store_true", help="Delete seeded data before inserting.")

	def handle(self, *args, **options):
		reset = options.get("reset", False)
		if reset:
			self._reset_seeded_data()

		co_so_list = self._seed_co_so_dao_tao(3)
		teachers = self._seed_giao_vien(20)
		lops = self._seed_lops(co_so_list, 30)
		ca_days = self._seed_ca_days(lops, 2)
		self._seed_lich_days(ca_days, teachers, 10)
		self._seed_ngay_lam_viec(teachers, 7)

		self.stdout.write(self.style.SUCCESS("Seed data completed."))

	def _reset_seeded_data(self):
		LichDay.objects.all().delete()
		NgayLamViec.objects.all().delete()
		CaDay.objects.all().delete()
		Lop.objects.all().delete()
		GiaoVien.objects.all().delete()
		CoSoDaoTao.objects.all().delete()
		User.objects.filter(username__startswith="teacher_").delete()
		User.objects.filter(username__startswith="staff_").delete()

	def _seed_co_so_dao_tao(self, count):
		if CoSoDaoTao.objects.exists():
			return list(CoSoDaoTao.objects.all())
		return [
			CoSoDaoTao.objects.create(ten_co_so=f"Co so {i + 1}") for i in range(count)
		]

	def _seed_giao_vien(self, count):
		if GiaoVien.objects.exists():
			return list(GiaoVien.objects.all())

		teachers = []
		for i in range(count):
			username = f"teacher_{i + 1:02d}"
			user = User.objects.create_user(
				username=username,
				email=f"{username}@example.com",
				password="password123",
				status="teacher",
			)
			teachers.append(
				GiaoVien.objects.create(ho_ten=f"Giao vien {i + 1}", user=user)
			)
		return teachers

	def _seed_lops(self, co_so_list, count):
		if Lop.objects.exists():
			return list(Lop.objects.all())

		lops = []
		for i in range(count):
			khoi = random.randint(6, 12)
			start_date = date.today() - timedelta(days=random.randint(0, 90))
			end_date = start_date + timedelta(days=random.randint(30, 120))
			lops.append(
				Lop.objects.create(
					ma_lop=f"K{khoi}.{i + 1:02d}",
					mon_hoc=f"Mon {random.randint(1, 8)}",
					ten_lop=f"Lop Khoi {khoi} - {i + 1}",
					khoi=khoi,
					ngay_bat_dau=start_date,
					ngay_ket_thuc=end_date,
					trang_thai=random.choice(["dang_mo", "dang_hoc", "tam_dung", "da_ket_thuc"]),
					mo_ta="",
					co_so_dao_tao=random.choice(co_so_list),
				)
			)
		return lops

	def _seed_ca_days(self, lops, per_lop):
		if CaDay.objects.exists():
			return list(CaDay.objects.all())

		ca_days = []
		for lop in lops:
			for index in range(per_lop):
				start_hour = 7 + index * 2
				start_time = datetime.strptime(f"{start_hour}:00", "%H:%M").time()
				end_time = datetime.strptime(f"{start_hour + 2}:00", "%H:%M").time()
				ca_days.append(
					CaDay.objects.create(
						lop=lop,
						ten_ca=f"ca{index + 1}",
						gio_bat_dau=start_time,
						gio_ket_thuc=end_time,
					)
				)
		return ca_days

	def _seed_lich_days(self, ca_days, teachers, day_span):
		if LichDay.objects.exists():
			return

		start_date = date.today() - timedelta(days=day_span)
		for offset in range(day_span):
			current_date = start_date + timedelta(days=offset)
			for ca_day in random.sample(ca_days, k=min(5, len(ca_days))):
				LichDay.objects.create(
					ngay_day=current_date,
					giao_vien=random.choice(teachers),
					ca_day=ca_day,
				)

	def _seed_ngay_lam_viec(self, teachers, day_span):
		if NgayLamViec.objects.exists():
			return

		start_date = date.today() - timedelta(days=day_span)
		for teacher in teachers:
			for offset in range(0, day_span, 2):
				current_date = start_date + timedelta(days=offset)
				NgayLamViec.objects.create(
					giao_vien=teacher,
					ngay_co_the=current_date,
					gio_bat_dau=datetime.strptime("08:00", "%H:%M").time(),
					gio_ket_thuc=datetime.strptime("16:00", "%H:%M").time(),
				)
