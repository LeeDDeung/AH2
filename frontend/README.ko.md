# openAH 프론트엔드

[English](README.md)

예측, 분포, 플래너, AI 채팅 화면을 제공하는 프론트엔드 앱입니다.

## 요구 사항

- Node.js 20 이상
- npm 10 이상
- 백엔드 실행 중 (`http://127.0.0.1:8080` 기본)

## 환경 변수

1. 로컬 오버라이드가 필요하면 복사
   - `cp .env.example .env.local`
2. 주요 값
   - `VITE_API_BASE_URL=/api`
   - `BACKEND_TARGET=http://127.0.0.1:8080`
   - `VITE_DEMO_MODE=false`

참고:
- `vite.config.js`가 `/api`, `/health` 요청을 백엔드로 프록시합니다.
- 로컬 개발에서는 `../backend/.env`를 읽어 `x-api-key`를 자동 주입할 수 있습니다.

## 실행

- 설치: `npm install`
- 개발 서버: `npm run dev -- --host 127.0.0.1 --port 5173`
- 빌드: `npm run build`
- 린트: `npm run lint`
- 빌드 결과 미리보기: `npm run preview`

접속 주소: [http://127.0.0.1:5173](http://127.0.0.1:5173)
