# OpenAH Full Stack (Frontend + Backend)

This repository now runs as a connected full service:

- Frontend: React/Vite app in `/Users/admin/Desktop/openAH_01/frontend`
- Backend: Secure Express API in `/Users/admin/Desktop/openAH_01/backend`
- Data-driven prediction model bootstrapped from `/Users/admin/Desktop/openAH_01/DATA/train.csv`

## Quick Start

1. Backend setup
   - `cd /Users/admin/Desktop/openAH_01/backend`
   - `cp .env.example .env`
   - Fill at least `API_KEY`, `LOG_SALT`, and optionally `OPENAI_API_KEY`
   - `npm install`
   - `npm start`

2. Frontend setup
   - `cd /Users/admin/Desktop/openAH_01/frontend`
   - `cp .env.example .env.local` (optional)
   - `npm install`
   - `npm run dev -- --host 127.0.0.1 --port 5173`

3. Open
   - [http://127.0.0.1:5173](http://127.0.0.1:5173)

## API Contract Used by Frontend

- `POST /api/predict`
- `POST /api/distribution`
- `POST /api/planner`
- `POST /api/chat`
- `GET /health`

The frontend uses Vite proxy and forwards requests to backend (`http://127.0.0.1:8080` by default).  
In local dev, `frontend/vite.config.js` can automatically read `backend/.env` `API_KEY` and inject `x-api-key` in proxy requests.

## Notes

- If `OPENAI_API_KEY` is not configured, `/api/chat` returns a 503-style service-disabled response.
- Legacy endpoints remain available:
  - `POST /api/v1/predictions`
  - `POST /api/v1/chat`
