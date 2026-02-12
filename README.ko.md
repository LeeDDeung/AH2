# OpenAH 풀스택 (프론트엔드 + 백엔드)

[English](README.md)

OpenAH는 프론트엔드와 백엔드가 연결된 서비스입니다.

- 프론트엔드: `frontend/` (React + Vite)
- 백엔드: `backend/` (보안 설정된 Express API)
- 데이터 모델 소스: `DATA/train.csv`

## 실행 전 준비

- Node.js 20 이상
- npm 10 이상

## 로컬 실행 방법

1. 의존성 설치
   - `npm install --prefix backend`
   - `npm install --prefix frontend`

2. 백엔드 환경 변수 설정
   - `cp backend/.env.example backend/.env`
   - 최소 아래 항목 설정:
     - `API_KEY`
     - `LOG_SALT`
     - `OPENAI_API_KEY` (AI 채팅 필수)
   - 모델은 기본값 `OPENAI_MODEL=gpt-5-mini` 사용

3. 백엔드 실행 (터미널 1)
   - `cd backend`
   - `npm start`

4. 프론트엔드 실행 (터미널 2)
   - `cd frontend`
   - `npm run dev -- --host 127.0.0.1 --port 5173`

5. 브라우저 접속
   - [http://127.0.0.1:5173](http://127.0.0.1:5173)

## 프론트-백엔드 연결 정보

- 프론트엔드가 사용하는 API:
  - `POST /api/predict`
  - `POST /api/distribution`
  - `POST /api/planner`
  - `POST /api/chat`
  - `GET /health`
- Vite 프록시가 `/api`, `/health` 요청을 백엔드(`http://127.0.0.1:8080`)로 전달합니다.
- 로컬 개발 시 `frontend/vite.config.js`가 `backend/.env`의 `API_KEY`를 읽어 `x-api-key`를 자동 주입할 수 있습니다.

## 보안/비공개 설정

- `DATA/` 폴더는 git 추적에서 제외됩니다.
- `.env` 파일은 git 추적에서 제외되고 `.env.example`만 추적됩니다.
- 실제 키는 로컬 `backend/.env`에만 보관하세요.

## 검증 명령어

- 백엔드 테스트: `npm test --prefix backend`
- 프론트 린트: `npm run lint --prefix frontend`
- 프론트 빌드: `npm run build --prefix frontend`
