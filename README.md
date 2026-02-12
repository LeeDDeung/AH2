# OpenAH Full Stack (Frontend + Backend)

[한국어 문서](README.ko.md)

OpenAH is a connected full-stack service:

- Frontend: React + Vite app in `frontend/`
- Backend: Secure Express API in `backend/`
- Data model source: `DATA/train.csv`

## Prerequisites

- Node.js 20+
- npm 10+

## Run Locally

1. Install dependencies
   - `npm install --prefix backend`
   - `npm install --prefix frontend`

2. Configure backend environment
   - `cp backend/.env.example backend/.env`
   - Set at least:
     - `API_KEY`
     - `LOG_SALT`
     - `OPENAI_API_KEY` (required for AI chat)
   - Default model is already `OPENAI_MODEL=gpt-5-mini`

3. Start backend (terminal 1)
   - `cd backend`
   - `npm start`

4. Start frontend (terminal 2)
   - `cd frontend`
   - `npm run dev -- --host 127.0.0.1 --port 5173`

5. Open browser
   - [http://127.0.0.1:5173](http://127.0.0.1:5173)

## Frontend-Backend Connection

- Frontend calls:
  - `POST /api/predict`
  - `POST /api/distribution`
  - `POST /api/planner`
  - `POST /api/chat`
  - `GET /health`
- Vite proxy forwards `/api` and `/health` to backend (`http://127.0.0.1:8080` by default).
- In local dev, `frontend/vite.config.js` can read `backend/.env` and auto-inject `x-api-key`.

## Security and Secret Handling

- `DATA/` is git-ignored.
- `.env` files are git-ignored (only `.env.example` is tracked).
- Keep real API keys only in local `backend/.env`.

## Validation Commands

- Backend tests: `npm test --prefix backend`
- Frontend lint: `npm run lint --prefix frontend`
- Frontend build: `npm run build --prefix frontend`
