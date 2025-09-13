# 📋 Growit AI 서비스 - 개발 현황

## 🎯 프로젝트 개요

**MSA 구조의 AI 멘토 서비스** - NestJS 기반으로 OpenAI를 활용한 개인화된 조언 및 목표 추천 시스템

## 📊 현재 진행률: **85%**

### 🏗️ 프로젝트 구조

```
src/
├── ai/                    # AI 서비스 모듈
│   ├── controllers/       # API 엔드포인트
│   ├── services/         # 비즈니스 로직
│   └── dto/              # 데이터 전송 객체
├── common/               # 공통 유틸리티
├── config/               # 설정 파일
├── external/             # 외부 API 연동
└── schedulers/           # 스케줄링 작업
```

### ✅ 완료된 기능

- **AI 조언 생성** (95%) - OpenAI 연동, 프롬프트 템플릿
- **목표 추천** (90%) - 개인화된 목표 생성
- **스케줄링** (85%) - 일일 조언 자동 생성
- **Spring Boot 연동** (90%) - MSA 통신

### 🚧 현재 이슈

- **환경 설정**: `.env` 파일 필요 (OPENAI_API_KEY)
- **컴파일 에러**: 의존성 문제 해결 중

### 🚀 다음 단계

1. 환경 변수 설정 완료
2. 남은 엔티티 구현
3. 테스트 코드 작성
4. 배포 준비

### 🛠️ 기술 스택

- **Backend**: NestJS, TypeScript
- **AI**: OpenAI GPT-4
- **DB**: PostgreSQL (TypeORM)
- **Architecture**: MSA, DDD
