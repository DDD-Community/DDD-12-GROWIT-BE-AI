# Growit AI - DDD Architecture with NestJS

OpenAI API를 활용한 AI 멘토 자동 생성 시스템

## 🏗️ 프로젝트 구조

```
src/
├── ai/                       # AI 도메인
│   ├── domain/              # 🎯 도메인 계층
│   │   ├── ai.domain.ts     # AI 엔티티
│   │   ├── ai-role.domain.ts # AI Role 엔티티
│   │   ├── repositories/    # 리포지토리 인터페이스
│   │   └── vo/mentor.ts     # 멘토 직업/성격 enum
│   ├── application/         # 🔧 애플리케이션 계층
│   │   ├── use-cases/       # 유스케이스
│   │   └── services/        # OpenAI 서비스
│   ├── infrastructure/      # 🏗️ 인프라 계층
│   │   └── persistence/     # DB 구현체
│   └── presentation/        # 🎨 프레젠테이션 계층
│       └── controllers/     # REST API
├── common/                  # 공통 모듈
│   ├── config/             # 설정
│   ├── decorators/         # 커스텀 데코레이터
│   ├── guards/             # JWT 인증
│   └── utils/              # 유틸리티
└── main.ts                 # 진입점
```

## 🎯 DDD 레이어별 역할

| 계층               | 역할               | 현재 구현                               |
| ------------------ | ------------------ | --------------------------------------- |
| **Domain**         | 비즈니스 로직 핵심 | AI/AiRole 엔티티, Repository 인터페이스 |
| **Application**    | 유스케이스 구현    | CreateAiUseCase, OpenAiService          |
| **Infrastructure** | 외부 시스템 연동   | TypeORM, OpenAI API                     |
| **Presentation**   | 외부 인터페이스    | REST Controller, JWT Guard              |

## 🚀 시작하기

```bash
# 설치
yarn install

# 환경변수 설정
cp env.example .env

# 개발 서버 실행
yarn dev
```

## 📝 API

### AI 생성

```bash
POST /ai
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "mentorCategory": "기획자"
}
```

**사용 가능한 카테고리**: `기획자`, `개발자`, `디자이너`, `프로젝트매니저`, `데이터분석가`, `품질보증`

## 🛠️ 기술 스택

- **Framework**: NestJS + TypeScript
- **Database**: PostgreSQL + TypeORM
- **Authentication**: JWT + Passport
- **AI**: OpenAI API
- **Code Quality**: ESLint + Prettier

## 🔧 개발 도구

```bash
# 코드 정리
yarn format

# 테스트
yarn test

# 빌드
yarn build
```

## 📚 DDD 원칙

- **의존성 역전**: 도메인이 인프라에 의존하지 않음
- **계층 분리**: 각 계층의 역할과 책임 명확히 구분
- **도메인 중심**: 비즈니스 로직을 도메인에 집중
