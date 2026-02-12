# openAH 백엔드 (보안 강화)

[English](README.md)

현재 프론트엔드 API 계약을 그대로 지원하도록 구현된 백엔드입니다.

## 제공 API

- `POST /api/predict`
  - 프론트엔드 TypeScript 요청 스키마를 받습니다.
  - 프론트에 바로 표시 가능한 확률 응답(`probability`, CI, 코호트 통계, 주요 요인)을 반환합니다.
- `POST /api/distribution`
  - 의사용 분포 그래프 데이터(코호트 분포)를 반환합니다.
- `POST /api/planner`
  - 플래너 화면용 리스크 밴드와 추천 플랜을 반환합니다.
- `POST /api/chat`
  - 채팅 페이지 포맷 `{ role, messages }`를 받습니다.
  - OpenAI `gpt-5-mini` 모델과 역할별 시스템 프롬프트를 사용합니다.
- `POST /api/v1/predictions`
  - 레거시/간단 포맷 요청을 받습니다.
  - `probability`, `message`를 반환합니다.
  - 시작 시 `DATA/train.csv` 기반 경량 통계 예측기를 구성합니다.
- `POST /api/v1/chat`
  - 레거시/간단 포맷 `{ message, history }`를 받습니다.
  - OpenAI 공식 SDK로 `gpt-5-mini` 모델을 호출합니다.
- `GET /health`
  - 서비스 준비 상태와 모델 정보를 반환합니다.

## 보안 제어

- 엄격한 CORS 허용 목록 (`CORS_ALLOW_ORIGINS`)
- 보호 API용 키 인증 (`x-api-key`)
- 보안 헤더 강제
- 쓰기 API JSON 전용 강제
- 요청 바디 크기 제한
- IP 기준 속도 제한 (전역 + 엔드포인트별)
- 요청 ID 전파 (`x-request-id`)
- 구조화 로그 + IP 해시 처리(원본 IP 로그 미저장)
- 안전한 에러 응답(스택 노출 금지)

## 설정 및 실행

1. 환경 파일 복사
   - `cp .env.example .env`
2. `.env`에 강한 비밀값 설정
   - `API_KEY`
   - `LOG_SALT`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL=gpt-5-mini` (기본값)
3. 설치 및 실행
   - `npm install`
   - `npm run dev`

기본 서버: `http://localhost:8080`

## API 예시

예측 요청:

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

채팅 요청:

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
