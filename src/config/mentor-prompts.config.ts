import { MentorType } from '../ai/domain/value-objects/mentor-type.vo';
export const DEFAULT_ADVICE_TEMPLATES: Record<MentorType, string> = {
  [MentorType.팀쿡]:
    '오늘도 집중해서 프로젝트를 진행해보자. 작은 성취도 중요한 발걸음이야.',
  [MentorType.공자]:
    '꾸준히 배우고 실천하는 것이야말로 진정한 성장의 길이다. 오늘도 한 걸음씩 나아가보자.',
  [MentorType.워렌버핏]:
    '투자에서 가장 중요한 건 인내야. 오늘 하루도 꾸준히 실력을 쌓아가자구.',
};
