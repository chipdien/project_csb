# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class EduClasses(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255)
    active = models.CharField(max_length=255, blank=True, null=True)
    open_date = models.DateField()
    note = models.TextField(blank=True, null=True)
    fee = models.FloatField(blank=True, null=True)
    cost = models.FloatField(blank=True, null=True)
    center_id = models.SmallIntegerField()
    course_id = models.SmallIntegerField()
    year = models.SmallIntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    created_by_id = models.BigIntegerField(blank=True, null=True)
    updated_by_id = models.BigIntegerField(blank=True, null=True)
    fee_per_hour = models.FloatField(blank=True, null=True)
    synced_at = models.DateTimeField(blank=True, null=True)
    cost_teacher = models.FloatField(blank=True, null=True)
    pic_admin = models.BigIntegerField(blank=True, null=True)
    pic_assistant = models.BigIntegerField(blank=True, null=True)
    ver_sync = models.CharField(max_length=255, blank=True, null=True)
    friendly_class_schedule = models.CharField(max_length=255, blank=True, null=True)
    friendly_class_teachers = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'edu_classes'


class Centers(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    bank_code = models.CharField(max_length=255)
    bank_number = models.CharField(max_length=255)
    bank_owner = models.CharField(max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    created_by_id = models.BigIntegerField(blank=True, null=True)
    updated_by_id = models.BigIntegerField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    address = models.CharField(max_length=255)
    contact_info = models.JSONField(blank=True, null=True)
    bank_info = models.JSONField(blank=True, null=True)
    synced_at = models.DateTimeField(blank=True, null=True)
    center_director_id = models.BigIntegerField(blank=True, null=True)
    center_manager_id = models.BigIntegerField(blank=True, null=True)
    ver_sync = models.CharField(max_length=255, blank=True, null=True)
    bank_qr = models.CharField(max_length=255, blank=True, null=True)
    email_password = models.CharField(max_length=255, blank=True, null=True)
    email_server = models.CharField(max_length=255, blank=True, null=True)
    email_port = models.FloatField(blank=True, null=True)
    email_template_group = models.CharField(max_length=255, blank=True, null=True)
    phone_tuyensinh = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'centers'


class EduCourses(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    grade = models.SmallIntegerField()
    domain_id = models.BigIntegerField(blank=True, null=True)
    center_id = models.BigIntegerField(blank=True, null=True)
    showable = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    created_by_id = models.BigIntegerField(blank=True, null=True)
    updated_by_id = models.BigIntegerField(blank=True, null=True)
    synced_at = models.DateTimeField(blank=True, null=True)
    ver_sync = models.CharField(max_length=255, blank=True, null=True)
    level = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'edu_courses'


class EduDomains(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    slug = models.CharField(unique=True, max_length=255)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    created_by_id = models.BigIntegerField(blank=True, null=True)
    updated_by_id = models.BigIntegerField(blank=True, null=True)
    synced_at = models.DateTimeField(blank=True, null=True)
    ver_sync = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'edu_domains'


class EduSessions(models.Model):
    id = models.BigAutoField(primary_key=True)
    class_id = models.SmallIntegerField()
    center_id = models.SmallIntegerField()
    room_id = models.SmallIntegerField(blank=True, null=True)
    from_field = models.DateTimeField(db_column='from')  # Field renamed because it was a Python reserved word.
    to = models.DateTimeField()
    date = models.DateField()
    type = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    content_files = models.TextField(blank=True, null=True)
    exercice = models.TextField(blank=True, null=True)
    exercice_files = models.TextField(blank=True, null=True)
    note = models.TextField(blank=True, null=True)
    ss_number = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    teacher_id = models.IntegerField()
    deleted_at = models.DateTimeField(blank=True, null=True)
    fee = models.FloatField(blank=True, null=True)
    cost = models.FloatField(blank=True, null=True)
    duration = models.FloatField(blank=True, null=True)
    synced_at = models.DateTimeField(blank=True, null=True)
    teacher_in = models.TimeField(blank=True, null=True)
    student_present = models.FloatField(blank=True, null=True)
    teacher_out = models.TimeField(blank=True, null=True)
    created_by_id = models.BigIntegerField(blank=True, null=True)
    updated_by_id = models.BigIntegerField(blank=True, null=True)
    sort = models.BigIntegerField(blank=True, null=True)
    session_income = models.FloatField(blank=True, null=True)
    session_revenue = models.FloatField(blank=True, null=True)
    session_revenue_net = models.FloatField(blank=True, null=True)
    session_discout = models.FloatField(blank=True, null=True)
    session_income_tmp = models.FloatField(blank=True, null=True)
    base_student_fee = models.FloatField(blank=True, null=True)
    student_present_man = models.FloatField(blank=True, null=True)
    pic_admin = models.BigIntegerField(blank=True, null=True)
    ver_sync = models.CharField(max_length=255, blank=True, null=True)
    info_session1 = models.TextField(blank=True, null=True)
    session_comment = models.TextField(blank=True, null=True)
    comment_files = models.TextField(blank=True, null=True)
    session_type = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'edu_sessions'


class EduTeachers(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=255, blank=True, null=True)
    school = models.CharField(max_length=255, blank=True, null=True)
    avatar = models.CharField(max_length=255, blank=True, null=True)
    ref_code = models.CharField(unique=True, max_length=255, blank=True, null=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    domain = models.CharField(max_length=255, blank=True, null=True)
    note = models.CharField(max_length=255, blank=True, null=True)
    device_token = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    gender = models.CharField(max_length=255, blank=True, null=True)
    otp = models.CharField(max_length=255, blank=True, null=True)
    sent_otp_at = models.DateTimeField(blank=True, null=True)
    synced_at = models.DateTimeField(blank=True, null=True)
    created_by_id = models.BigIntegerField(blank=True, null=True)
    updated_by_id = models.BigIntegerField(blank=True, null=True)
    schoolyears = models.JSONField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    vnid_number = models.CharField(unique=True, max_length=255, blank=True, null=True)
    vnid_date = models.DateField(blank=True, null=True)
    vnid_validity_until = models.DateField(blank=True, null=True)
    vnid_issued_by = models.CharField(max_length=255, blank=True, null=True)
    address_alt = models.TextField(blank=True, null=True)
    display_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'edu_teachers'


class EduClassConfigs(models.Model):
    id = models.BigAutoField(primary_key=True)
    class_id = models.IntegerField()
    teacher_id = models.IntegerField()
    from_field = models.DateTimeField(db_column='from')  # Field renamed because it was a Python reserved word.
    to = models.DateTimeField()
    room_id = models.SmallIntegerField(blank=True, null=True)
    date = models.SmallIntegerField()
    fav = models.IntegerField()
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    fee = models.IntegerField()
    synced_at = models.DateTimeField(blank=True, null=True)
    pic_admin = models.BigIntegerField(blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    status = models.CharField(max_length=255, blank=True, null=True)
    note = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'edu_class_configs'


