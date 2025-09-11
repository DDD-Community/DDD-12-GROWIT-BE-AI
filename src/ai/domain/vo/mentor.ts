export enum 멘토직업 {
  기획자 = '기획자',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER',
  PM = 'PM',
  DA = 'DA',
  QA = 'QA',
}
export const Mentor = 멘토직업;

export enum 멘토성격 {
  전략적 = '전략적',
  실행력 = '실행력',
  기술적 = '기술적',
  커리어 = '커리어',
  창의적 = '창의적',
  UX리서치 = 'UX리서치',
  리더십 = '리더십',
  프로세스 = '프로세스',
  비즈니스 = '비즈니스',
  테스팅 = '테스팅',
  자동화 = '자동화',
}

export interface 멘토성격Info {
  type: 멘토성격;
  name: string;
}

// 멘토 카테고리별 타입 매핑
export const MENTOR_TYPES: Record<멘토직업, 멘토성격Info[]> = {
  [멘토직업.기획자]: [
    { type: 멘토성격.전략적, name: '전략기획 멘토' },
    { type: 멘토성격.실행력, name: '실행기획 멘토' },
  ],
  [멘토직업.DEVELOPER]: [
    { type: 멘토성격.기술적, name: '기술전문 멘토' },
    { type: 멘토성격.커리어, name: '커리어 멘토' },
  ],
  [멘토직업.DESIGNER]: [
    { type: 멘토성격.창의적, name: '크리에이티브 멘토' },
    { type: 멘토성격.UX리서치, name: 'UX리서치 멘토' },
  ],
  [멘토직업.PM]: [
    { type: 멘토성격.리더십, name: '리더십 멘토' },
    { type: 멘토성격.프로세스, name: '프로세스 멘토' },
  ],
  [멘토직업.DA]: [
    { type: 멘토성격.기술적, name: '분석기술 멘토' },
    { type: 멘토성격.비즈니스, name: '비즈니스 멘토' },
  ],
  [멘토직업.QA]: [
    { type: 멘토성격.테스팅, name: '테스팅 전문 멘토' },
    { type: 멘토성격.자동화, name: '자동화 멘토' },
  ],
};
