export enum 멘토직업 {
  PLANNER = 'PLANNER',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
  PM = 'PM',
  DATA_ANALYST = 'DATA_ANALYST',
  QA = 'QA',
}

export enum 멘토성격 {
  STRATEGIC = 'STRATEGIC',
  EXECUTION = 'EXECUTION',
  TECHNICAL = 'TECHNICAL',
  CAREER = 'CAREER',
  CREATIVE = 'CREATIVE',
  UX_RESEARCH = 'UX_RESEARCH',
  LEADERSHIP = 'LEADERSHIP',
  PROCESS = 'PROCESS',
  BUSINESS = 'BUSINESS',
  TESTING = 'TESTING',
  AUTOMATION = 'AUTOMATION',
}

export interface 멘토성격Info {
  type: 멘토성격;
  name: string;
}

// 멘토 카테고리별 타입 매핑
export const MENTOR_TYPES: Record<멘토직업, 멘토성격Info[]> = {
  [멘토직업.PLANNER]: [
    { type: 멘토성격.STRATEGIC, name: '전략기획 멘토' },
    { type: 멘토성격.EXECUTION, name: '실행기획 멘토' },
  ],
  [멘토직업.DEVELOPER]: [
    { type: 멘토성격.TECHNICAL, name: '기술전문 멘토' },
    { type: 멘토성격.CAREER, name: '커리어 멘토' },
  ],
  [멘토직업.DESIGNER]: [
    { type: 멘토성격.CREATIVE, name: '크리에이티브 멘토' },
    { type: 멘토성격.UX_RESEARCH, name: 'UX리서치 멘토' },
  ],
  [멘토직업.PM]: [
    { type: 멘토성격.LEADERSHIP, name: '리더십 멘토' },
    { type: 멘토성격.PROCESS, name: '프로세스 멘토' },
  ],
  [멘토직업.DATA_ANALYST]: [
    { type: 멘토성격.TECHNICAL, name: '분석기술 멘토' },
    { type: 멘토성격.BUSINESS, name: '비즈니스 멘토' },
  ],
  [멘토직업.QA]: [
    { type: 멘토성격.TESTING, name: '테스팅 전문 멘토' },
    { type: 멘토성격.AUTOMATION, name: '자동화 멘토' },
  ],
} as const;

export const Mentor = 멘토직업;
