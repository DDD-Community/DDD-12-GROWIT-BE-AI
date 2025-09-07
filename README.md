# Growit AI - DDD Architecture with NestJS

이 프로젝트는 Domain-Driven Design (DDD) 아키텍처를 기반으로 한 NestJS 애플리케이션입니다.

## 🏗️ 아키텍처 구조

```
src/
├── domain/                    # 도메인 계층
│   ├── entities/             # 도메인 엔티티
│   ├── value-objects/        # 값 객체
│   ├── repositories/         # 리포지토리 인터페이스
│   ├── services/            # 도메인 서비스
│   └── events/              # 도메인 이벤트
├── application/              # 애플리케이션 계층
│   ├── use-cases/           # 유스케이스
│   ├── dto/                 # 데이터 전송 객체
│   └── interfaces/          # 애플리케이션 인터페이스
├── infrastructure/           # 인프라스트럭처 계층
│   ├── database/            # 데이터베이스 관련
│   ├── external-services/   # 외부 서비스
│   └── config/              # 설정
├── presentation/             # 프레젠테이션 계층
│   ├── controllers/         # 컨트롤러
│   ├── modules/             # NestJS 모듈
│   ├── guards/              # 가드
│   └── interceptors/        # 인터셉터
└── shared/                   # 공유 계층
    ├── errors/              # 공통 에러
    ├── utils/               # 유틸리티
    └── constants/           # 상수
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`env.example` 파일을 참고하여 `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요.

```bash
cp env.example .env
```

### 3. 데이터베이스 설정

PostgreSQL 데이터베이스를 설정하고 연결 정보를 환경 변수에 입력하세요.

### 4. 애플리케이션 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

## 📋 주요 기능

- **사용자 관리**: 사용자 생성, 조회, 수정, 비활성화
- **인증 시스템**: JWT 기반 인증
- **DDD 아키텍처**: 도메인 중심 설계
- **타입 안전성**: TypeScript 기반
- **데이터베이스**: TypeORM + PostgreSQL

## 🛠️ 기술 스택

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator
- **AI Integration**: OpenAI API

## 📝 API 엔드포인트

### 사용자 관리

- `POST /api/v1/users` - 사용자 생성
- `GET /api/v1/users/:id` - 사용자 조회
- `PUT /api/v1/users/:id` - 사용자 정보 수정
- `DELETE /api/v1/users/:id` - 사용자 비활성화

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 📦 빌드

```bash
npm run build
```

## 🔧 개발 도구

- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Jest**: 테스트 프레임워크

## 📚 DDD 개념

이 프로젝트는 다음과 같은 DDD 개념을 적용했습니다:

- **Entity**: 고유 식별자를 가진 도메인 객체
- **Value Object**: 불변 값 객체
- **Repository**: 도메인 객체의 영속성 관리
- **Domain Service**: 도메인 로직 캡슐화
- **Use Case**: 애플리케이션 서비스
- **Result Pattern**: 에러 처리 및 반환값 관리
