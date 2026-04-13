# Quan Ly Giang Vien

Monorepo gom:
- `client/`: frontend Vite + React
- `backend/`: Django API

## Yeu cau
- Python 3.11+
- Node.js 20+
- Docker Desktop neu chay bang container

## Luu y ve database
- `default`: DB cong ty, cau hinh qua file `.env`
- `local_authz`: DB local cua service nay, dung cho role/permission noi bo

Khong chay `migrate` vao DB cong ty neu ban khong chu dong thay doi schema cua he thong do.

## Chay backend local
```powershell
cd backend
.venv\Scripts\python.exe -m pip install -r requirements.txt
.venv\Scripts\python.exe manage.py migrate --database local_authz
.venv\Scripts\python.exe manage.py runserver
```

## Chay frontend local
```powershell
cd client
npm install
npm run dev
```

## Huong dan migrate

### Migrate local authorization database
Day la DB rieng cua service nay, an toan de migrate:

```powershell
cd backend
.venv\Scripts\python.exe manage.py migrate --database local_authz
```

Neu can tao moi DB local authz tu dau, van dung lenh tren.

### Kiem tra migration
```powershell
cd backend
.venv\Scripts\python.exe manage.py showmigrations users --database local_authz
```

### Khong migrate DB cong ty
Lenh sau se dung `default` database:

```powershell
python manage.py migrate
```

Chi dung no khi ban thuc su muon thay doi schema cua DB mac dinh.

## Chay bang Docker
```powershell
docker compose up --build
```

Sau khi chay:
- frontend: `http://localhost`
- api docs: `http://localhost/api/docs/`
- django admin: `http://localhost/admin/`

Container backend se tu dong chay:

```powershell
python manage.py migrate --database local_authz --noinput
```

khi khoi dong.
