FROM node:20-alpine AS builder

WORKDIR /app/frontend

ARG VITE_API_BASE_URL=/api

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM nginx:1.27-alpine

COPY frontend/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80
