# Django Deployment Checklist

- Set `DEBUG=False` outside local development.
- Set `ALLOWED_HOSTS` explicitly.
- Keep `SECRET_KEY` and database credentials in environment variables.
- Review `CSRF_TRUSTED_ORIGINS` and secure cookies in production.
- Run `manage.py check` and targeted tests after settings changes.
