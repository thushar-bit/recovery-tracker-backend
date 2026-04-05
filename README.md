# Recovery Tracker

Daily routine tracker + tech roadmap. Built with Vue 3 + TypeScript + Node.js + PostgreSQL.

---

## Local setup on Pop OS (no Docker)

### 1. Install dependencies

```bash
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib
node -v   # should be 18+, if not: use nvm
```

### 2. Set up PostgreSQL

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'password';"
sudo -u postgres createdb recovery_tracker
```

### 3. Set up backend

```bash
cd backend
cp .env.example .env
# .env already has the right defaults for local dev
npm install
npm run dev
# Backend runs on http://localhost:3001
```

### 4. Set up frontend

```bash
# In a new terminal
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

Open http://localhost:5173 — done.

---

## Local setup with Docker (recommended)

```bash
# Install Docker on Pop OS
sudo apt install docker.io docker-compose-plugin
sudo systemctl enable docker
sudo usermod -aG docker $USER
# Log out and back in, then:

docker compose up --build
```

Open http://localhost:5173

---

## Deploy to Railway (free tier — data persists across devices)

### Backend

1. Go to https://railway.app and sign up with GitHub
2. New Project → Deploy from GitHub repo → select your repo
3. Set root directory to `backend/`
4. Add a PostgreSQL plugin — Railway auto-sets DATABASE_URL
5. Add environment variable: `FRONTEND_URL=https://your-frontend-url.vercel.app`
6. Deploy — Railway gives you a URL like `https://recovery-backend.up.railway.app`

### Frontend

1. Go to https://vercel.com and sign up with GitHub
2. Import your repo → set root directory to `frontend/`
3. Add environment variable:
   - `VITE_API_URL=https://recovery-backend.up.railway.app`
4. In `frontend/src/api.ts`, update baseURL:
   ```ts
   baseURL: import.meta.env.VITE_API_URL || '/api'
   ```
5. Deploy — Vercel gives you a URL

---

## Project structure

```
recovery-tracker/
├── backend/
│   ├── src/
│   │   ├── index.ts          ← Express server entry
│   │   ├── db.ts             ← PostgreSQL pool + schema init
│   │   └── routes/
│   │       ├── routine.ts    ← GET/POST routine completions + streak
│   │       └── roadmap.ts    ← GET/POST roadmap completions + stats
│   ├── Dockerfile
│   ├── railway.toml
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.ts           ← App entry
│   │   ├── App.vue           ← Layout + navigation
│   │   ├── router.ts         ← Vue Router
│   │   ├── api.ts            ← Axios API client
│   │   ├── data.ts           ← Routine tasks + roadmap phases
│   │   ├── style.css         ← Global styles
│   │   └── views/
│   │       ├── Routine.vue   ← Daily routine with streak
│   │       └── Roadmap.vue   ← 3-phase tech roadmap
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── .gitignore
```

---

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/routine?date=YYYY-MM-DD | Get today's completions |
| POST | /api/routine/toggle | Toggle a task done/undone |
| GET | /api/routine/streak | Get current streak count |
| GET | /api/routine/history | Last 30 days completion % |
| GET | /api/roadmap | All roadmap completions |
| POST | /api/roadmap/toggle | Toggle a topic done/undone |
| GET | /api/roadmap/stats | Per-phase completion stats |
| GET | /health | Health check |

---

## Adding your own tasks

Edit `frontend/src/data.ts`. The `ROUTINE` array and `PHASES` object are the single source of truth for all tasks.
