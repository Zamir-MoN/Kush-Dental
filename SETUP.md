# Kush Dental - Complete VPS Deployment & Migration Guide

## A. APPLICATION ARCHITECTURE

This is the exact production architecture for the Kush Dental application:
- **Frontend Framework**: React + Vite (Node.js)
- **Backend Framework**: Python (FastAPI)
- **Python Version**: Python 3.14 (requires `python3.14-dev`)
- **Database**: PostgreSQL
- **Database Migration**: Alembic
- **Task Queue/Worker**: Celery with Redis broker
- **Process Manager**: PM2
- **Backend Port**: 8000
- **Frontend Build Directory**: `./frontend/dist` (served via PM2 on port 3000)
- **Celery Worker Name**: `kush-dental-worker`
- **Backend Process Name**: `kush-dental-backend`
- **Dispatcher Process Name**: `kush-dental-dispatcher`
- **Frontend Process Name**: `kush-dental-frontend`

## B. DIRECTORY STRUCTURE

- **`frontend/`**: The React/Vite SPA. Contains UI components, pages, and assets. Build artifacts are output to `frontend/dist/`.
- **`python_backend/`**: The FastAPI application, Celery worker definitions, and Alembic migrations. Contains requirements.txt for dependencies.
- **`docs/`**: Project documentation, implementation guides, and integration guides.

Note: Only `frontend/dist` and `python_backend` are required to run the live application.

## C. FRESH UBUNTU VPS SETUP

Run the following commands on a fresh Ubuntu 22.04 LTS (or newer) VPS:

```bash
# 1. System Update
sudo apt-get update
sudo apt-get upgrade -y

# 2. Required System Packages
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y python3.14-dev python3.14-venv python3-dev build-essential curl git unzip redis-server postgresql postgresql-contrib

# 3. Node.js & npm (latest LTS recommended, 18.x or 20.x)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Global PM2 and serve
sudo npm install -g pm2 serve
```

## D. APPLICATION INSTALLATION

```bash
# 1. Create Deployment Directory
mkdir -p ~/dev
cd ~/dev

# 2. Extract / Clone Source (Assuming ZIP bundle is uploaded)
unzip Kush-Dental-deployment-bundle.zip
cd Kush-Dental-main

# 3. Python Backend Installation
cd python_backend
python3.14 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
chmod +x start.sh
cd ..

# 4. Frontend Installation
cd frontend
npm install
npm run build
cd ..
```

## E. ENVIRONMENT VARIABLES

**FRONTEND (`frontend/.env`)**:
- `VITE_TURNSTILE_SITE_KEY` (Required): Cloudflare Turnstile site key for spam protection.
  Example: `1x00000000000000000000AA`

**BACKEND (`python_backend/.env`)**:
- `DATABASE_URL` (Required): PostgreSQL connection string. 
  Example: `postgresql+asyncpg://YOUR_DB_USER:YOUR_DB_PASSWORD@localhost:5432/YOUR_DB_NAME`
- `TEST_DATABASE_URL` (Optional/Dev): Test DB connection string. Do NOT use in production.
- `PORT` (Optional): Backend port (default 8000).
- `NODE_ENV` (Optional): E.g., `development` or `production`.
- `JWT_SECRET` (Required): Cryptographic secret for signing tokens.
  Example: `YOUR_JWT_SECRET`
- `CORS_ORIGIN` (Required): The frontend URL permitted to make API calls. **MUST CHANGE ON NEW VPS**.
  Example: `http://YOUR_NEW_VPS_IP:3000` or `https://yourdomain.com`
- `LOG_LEVEL` (Optional): `debug`, `info`, etc.
- `COOKIE_SECURE` (Required): Set to `true` if using HTTPS.
- `SEED_STAFF_EMAIL` / `SEED_STAFF_PASSWORD`: For initial staff user creation.
- `SEED_DOCTOR_EMAIL` / `SEED_DOCTOR_PASSWORD`: For initial doctor user creation.
- `DXGEN_API_KEY` (Required): API Key to connect to the DXGen AI Service.

## F. DATABASE SETUP

```bash
# Enter PostgreSQL shell
sudo -u postgres psql

# Run the following SQL queries
CREATE DATABASE kush_dental_prod;
CREATE USER kush_dental_prod_user WITH ENCRYPTED PASSWORD 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE kush_dental_prod TO kush_dental_prod_user;
\c kush_dental_prod
GRANT ALL ON SCHEMA public TO kush_dental_prod_user;
\q
```

**Run Migrations:**
```bash
cd ~/dev/Kush-Dental-main/python_backend
source venv/bin/activate
alembic upgrade head
alembic check
```

**Note**: Do NOT use `kush_dental_test` in production. Make sure `DATABASE_URL` is pointing to `kush_dental_prod`.

## G. DATABASE MIGRATION FROM OLD VPS TO NEW VPS

**On OLD VPS:**
```bash
pg_dump -U kush_dental_dev -h localhost -F c -f kush_dental_backup.dump kush_dental_dev
scp kush_dental_backup.dump ubuntu@NEW_VPS_IP:~/
```

**On NEW VPS:**
```bash
pg_restore -U kush_dental_prod_user -h localhost -d kush_dental_prod -1 kush_dental_backup.dump
```
- Verify row counts using `psql` to ensure safe data transfer.
- The OLD VPS remains available until NEW VPS verification is complete. Do NOT perform filesystem copying of PostgreSQL data directories.

## H. REDIS

- Installation is covered in Section C (`redis-server`).
- Start service: `sudo systemctl enable redis-server && sudo systemctl start redis-server`
- Redis runs locally on port 6379 and does not need to be exposed via firewall.

## I. CELERY / WORKER

The worker runs via PM2 configuration (`ecosystem.config.js`).
- **Command**: `venv/bin/celery -A app.worker.celery_app worker --loglevel=info`
- **Broker**: Redis (`redis://localhost:6379/0`)
- **Process Name**: `kush-dental-worker`

**Restarting ONLY the worker:**
```bash
pm2 restart kush-dental-worker
```
*(Do NOT use `pm2 restart all` as it disrupts other services)*

## J. FASTAPI BACKEND

The backend is managed by PM2.
- **Directory**: `./python_backend`
- **Command**: `venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000`
- **Process Name**: `kush-dental-backend`
- **Restarting ONLY the backend:**
```bash
pm2 restart kush-dental-backend
```

## K. FRONTEND BUILD / NGINX

Currently, the frontend is built statically and served via PM2's `serve` module:
- **Build**: `npm run build` inside `frontend/`
- **Output**: `frontend/dist/`
- PM2 configuration specifies `PM2_SERVE_SPA: "true"` to route all unhandled requests to `index.html`.

If deploying a formal reverse proxy (Nginx):
- Create Nginx root at `/var/www/kush-dental/html` pointing to `frontend/dist/`.
- Setup a fallback `try_files $uri $uri/ /index.html;`.
- Proxy `/api/` to `127.0.0.1:8000`.

## L. DOMAIN + HTTPS

When ready for production HTTPS:
1. Update DNS A records to point to the new VPS IP.
2. If using Cloudflare, ensure "Full (Strict)" mode and use Origin Certificates, OR run `certbot` for Let's Encrypt.
3. Enforce HTTP -> HTTPS redirect in Nginx.
4. Set `COOKIE_SECURE=true` in backend `.env`.
5. Update `CORS_ORIGIN` in backend `.env` to the `https://` domain.
6. Verify Turnstile hostname settings in the Cloudflare dashboard.

## M. CRITICAL VPS MIGRATION CHECKLIST

**WHAT MUST CHANGE WHEN MOVING TO A NEW VPS**

| Item | Old Value | New Value | Where to Change | Why |
|---|---|---|---|---|
| **CORS_ORIGIN** | `http://3.109.4.37:3000` | `http://NEW_VPS_IP:3000` or Domain | `python_backend/.env` | Backend must accept API calls from new origin |
| **DXGen Integration** | `http://3.109.4.37:3101` | `http://NEW_VPS_IP:3101` | Integration Guides / Source code if hardcoded | If communicating with DXGen API externally |
| **DNS A Records** | `3.109.4.37` | `NEW_VPS_IP` | Domain Registrar / Cloudflare | Point users to the new server |
| **Turnstile Origin** | Old IP / Dev Domain | New Domain / New IP | Cloudflare Dashboard | Spam protection must trust the new origin |

*Note: Frontend `apiClient.ts` uses `window.location.hostname` to build the API URL, so no hardcoded IP changes are needed in frontend source.*

## N. PRODUCTION SECURITY

- Ensure UFW blocks all ports except 22 (SSH), 80 (HTTP), 443 (HTTPS), and any other explicitly required endpoints.
- PostgreSQL (5432) and Redis (6379) must **NOT** be publicly exposed.
- FastAPI backend should eventually be bound to `127.0.0.1` and proxied behind Nginx.
- Secure `.env` files with `chmod 600`.

## O. START / STOP / RESTART COMMANDS

From `/home/ubuntu/dev/Kush-Dental-main`:
- **Start All**: `pm2 start ecosystem.config.js && pm2 save`
- **Restart Backend ONLY**: `pm2 restart kush-dental-backend`
- **Restart Worker ONLY**: `pm2 restart kush-dental-worker`
- **Restart Frontend ONLY**: `pm2 restart kush-dental-frontend`
- **Restart Nginx ONLY**: `sudo systemctl restart nginx`

## P. COMPLETE DEPLOYMENT ORDER

1. Fresh VPS OS Setup & Update
2. Install System Dependencies (Python, Node.js, PostgreSQL, Redis, Nginx, PM2)
3. Extract Application Source Code
4. Create PostgreSQL Database and Users
5. Restore Old Database (using `pg_dump`/`pg_restore`)
6. Install Python Dependencies & Run Migrations (`alembic upgrade head`)
7. Install Node Dependencies & Build Frontend
8. Configure Environment Variables (`.env` for backend/frontend)
9. Start Services using PM2 (`pm2 start ecosystem.config.js`)
10. Verify processes (`pm2 status`)
11. Setup Nginx & Domain Configuration (HTTPS/Certificates)
12. Perform Smoke Test

## Q. FINAL SMOKE TEST

Perform these tests exactly to confirm the deployment:
1. Navigate to Homepage (ensure fast load).
2. Create a Normal Booking.
3. Submit a Homepage Inquiry.
4. Go to `/urgent-visit` and submit an urgent request.
5. Log in as Staff -> Verify Dashboard loads.
6. Log in as Doctor -> Verify Dashboard loads.
7. Verify Urgent Visits queue.
8. Test Lead conversion functionality.
9. Manually create an appointment.
10. Check Celery (`pm2 logs kush-dental-worker`) to see if background jobs processed.
11. Directly refresh a SPA route (e.g. `/staff/dashboard`) to ensure the server fallback to `index.html` works correctly.
