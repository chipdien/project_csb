from django.apps import AppConfig


# Undo test comment in apps.py.
class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.users'

    def ready(self):
        from . import schema  # noqa: F401
