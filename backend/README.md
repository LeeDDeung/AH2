# openAH Backend (Secure)

[한국어 문서](README.ko.md)

This backend serves the current frontend API contract without requiring frontend code changes.

## What It Provides

- `POST /api/predict`
  - Accepts the frontend TypeScript request schema.
  - Returns frontend-ready probability response (`probability`, CI, cohort stats, top factors).
- `POST /api/distribution`
  - Returns cohort distribution for doctor view.
- `POST /api/planner`
  - Returns risk band + recommended plans for planner view.
- `POST /api/chat`
  - Accepts `{ role, messages }` from frontend chat page.
  - Uses OpenAI model `gpt-5-mini` with role-aware system prompts.
- `POST /api/v1/predictions`
  - Accepts legacy/simple payload.
  - Returns `probability` and `message`.
  - Uses `DATA/train.csv` to build a lightweight statistical predictor at startup.
- `POST /api/v1/chat`
  - Accepts legacy/simple payload `{ message, history }`.
  - Uses OpenAI model `gpt-5-mini` through the official OpenAI SDK.
  - Intended for supportive, non-diagnostic responses.
- `GET /health`
  - Returns service readiness and model info.

## Security Controls

- Strict CORS allowlist (`CORS_ALLOW_ORIGINS`)
- API key auth (`x-api-key`) for protected APIs
- Strong security response headers
- JSON-only enforcement for write endpoints
- Request body size limit
- Per-IP rate limiting (global + endpoint specific)
- Request ID propagation (`x-request-id`)
- Structured logs with hashed IP (no raw IP logging)
- Safe error responses (no stack leakage to clients)

## Setup

1. Copy environment file:
   - `cp .env.example .env`
2. Set strong secrets in `.env`:
   - `API_KEY`
   - `LOG_SALT`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL=gpt-5-mini` (default)
3. Install and run:
   - `npm install`
   - `npm run dev`

Default server: `http://localhost:8080`

## Docker Notes

- `docker-compose.yml` mounts dataset from `./DATA` to `/app/DATA` (read-only).
- Backend container uses env from `backend/.env`.
- Frontend proxy container sends `x-api-key` server-side, so browser clients do not need to expose API keys.
- Backend container port is internal-only in Docker Compose (not published to host).

## API Examples

Prediction request:

```bash
curl -X POST http://localhost:8080/api/predict \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "basic": { "ageGroup": "AGE_35_37", "yearsInfertility": 2 },
    "procedure": { "procedureType": "IVF", "isOvulationStimulated": true, "isSingleEmbryoTransfer": false, "usePGT_A": false, "usePGT_M": false },
    "causes": { "maleFactor": true, "ovulatoryDisorder": true, "unknownFactor": false },
    "history": { "totalProcedures": "1", "totalClinicProcedures": "1", "ivfProcedures": "1", "diProcedures": "0", "totalPregnancies": "0", "ivfPregnancies": "0", "diPregnancies": "0", "totalBirths": "0", "ivfBirths": "0", "diBirths": "0" },
    "embryo": { "totalEmbryosCreated": 4, "embryosTransferred": 2, "embryosStored": 0, "embryosThawed": 0, "microInjectedEggs": 0, "microInjectedEmbryosCreated": 0, "microInjectedEmbryosTransferred": 0, "microInjectedEmbryosStored": 0, "eggSource": "PATIENT", "spermSource": "PARTNER", "useFrozenEmbryo": false, "useFreshEmbryo": false, "useDonorEmbryo": false, "isSurrogacy": false, "usePGD": false, "usePGS": false },
    "timeline": {}
  }'
```

Chat request:

```bash
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "role": "PATIENT",
    "messages": [
      { "role": "assistant", "content": "안녕하세요. 무엇을 도와드릴까요?" },
      { "role": "user", "content": "요즘 너무 불안해요." }
    ]
  }'
```
