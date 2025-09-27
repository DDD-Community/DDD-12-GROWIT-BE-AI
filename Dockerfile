# 1단계: 빌드 스테이지
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 설치 (개발 의존성 포함)
COPY package*.json ./
RUN npm ci --ignore-scripts

# 소스 코드 복사
COPY . .

# NestJS 빌드 (dist 폴더 생성)
RUN npm run build

# 2단계: 실행 스테이지
FROM node:18-alpine

# 보안을 위한 non-root 사용자 생성
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

WORKDIR /app

# 운영 환경 의존성만 설치
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# 빌드 결과 복사
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# non-root 사용자로 전환
USER nestjs

# 포트 노출
EXPOSE 3001


# 애플리케이션 실행
CMD ["node", "dist/main.js"]