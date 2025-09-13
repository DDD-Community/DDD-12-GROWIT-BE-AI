export enum IntimacyLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export const INTIMACY_CRITERIA = {
  [IntimacyLevel.HIGH]: {
    description: '전체 투두 50개 이상 + 주간 회고 2개 이상',
    minTodos: 50,
    minReviews: 2,
  },
  [IntimacyLevel.MEDIUM]: {
    description: '기본 상태 (디폴트)',
    minTodos: 20,
    minReviews: 1,
  },
  [IntimacyLevel.LOW]: {
    description: '전체 투두 20개 이하 + 주간 회고 1개 이하',
    minTodos: 0,
    minReviews: 0,
  },
} as const;
