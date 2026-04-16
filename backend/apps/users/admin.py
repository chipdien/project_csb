from django.contrib import admin

from .models import LocalPermission, LocalRole, LocalRolePermission, LocalUserRole, ServiceUser, User

# Undo test comment in admin.py.
admin.site.register(User)
admin.site.register(ServiceUser)
admin.site.register(LocalRole)
admin.site.register(LocalPermission)
admin.site.register(LocalUserRole)
admin.site.register(LocalRolePermission)
