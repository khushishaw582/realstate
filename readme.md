# Shaw Realtors CRM — Backend

Django REST API for the Shaw Realtors lead management system.

## Tech Stack
- Django + Django REST Framework
- SimpleJWT (authentication)
- PostgreSQL via Supabase (Mumbai region)

## Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
```

Create a `.env` file in this folder with:

SECRET_KEY=your-django-secret-key
DEBUG=True
DATABASE_URL=your-supabase-connection-string


Run migrations and start server:
```bash
python manage.py migrate
python manage.py runserver
```

Server runs at `http://localhost:8000`

## Apps
- `users` — auth, roles (admin/agent)
- `leads` — lead upload, assignment, CRUD
- `activities` — call logs, status updates, recordings
- `dashboard` — stats and reporting endpoints

## Notes
- Call recordings use local media storage — not production-safe on hosts with ephemeral disks (e.g. Render free tier). Needs cloud storage (S3/Cloudinary) before production use.
- Webhook endpoint `/api/leads/webhook/` accepts external lead ingestion (secret-key protected), for Google Sheets/Meta Lead Ads integration.

frontend/README.md

markdown
# Shaw Realtors CRM — Frontend

React (Vite) frontend for the Shaw Realtors CRM, plus public marketing landing page.

## Tech Stack
- React + Vite
- Tailwind CSS
- React Router
- lucide-react icons
- vite-plugin-pwa (installable as a PWA)

## Setup
```bash
cd frontend
npm install
```

Create a `.env` file in this folder with:

VITE_API_URL=http://localhost:8000


Run dev server:
```bash
npm run dev
```

Runs at `http://localhost:5173`

## Structure
- `pages/admin/` — admin dashboard, lead upload/assign, all leads
- `pages/agent/` — agent dashboard, my leads, lead detail
- `pages/Landing.jsx` — public marketing page (route: `/`)
- `components/` — shared UI (Navbar, Sidebar, LeadCard, Timeline, etc.)
- `auth/` — AuthContext, ProtectedRoute

## Build
```bash
npm run build
```
Output goes to `dist/`, deployed via Vercel (root directory set to `frontend`).