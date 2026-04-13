#!/bin/sh
set -eu

python manage.py migrate --database local_authz --noinput

exec gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3
