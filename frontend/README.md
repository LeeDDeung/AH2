# openAH Frontend

[한국어 문서](README.ko.md)

Frontend app for prediction, distribution, planner, and AI chat workflows.

## Requirements

- Node.js 20+
- npm 10+
- Running backend at `http://127.0.0.1:8080` (default)

## Environment

1. Copy env file (optional for local overrides):
   - `cp .env.example .env.local`
2. Main env values:
   - `VITE_API_BASE_URL=/api`
   - `BACKEND_TARGET=http://127.0.0.1:8080`
   - `VITE_DEMO_MODE=false`

Notes:
- `vite.config.js` proxies `/api` and `/health` to backend.
- In local dev, `vite.config.js` can read `../backend/.env` and inject `x-api-key` automatically.

## Run

- Install: `npm install`
- Dev server: `npm run dev -- --host 127.0.0.1 --port 5173`
- Build: `npm run build`
- Lint: `npm run lint`
- Preview build: `npm run preview`

Open: [http://127.0.0.1:5173](http://127.0.0.1:5173)

## Docker Notes

- Production-like frontend container is built via `frontend/Dockerfile` and served by Nginx.
- `/api` and `/health` are proxied to backend container (`backend:8080`) inside Docker network.
