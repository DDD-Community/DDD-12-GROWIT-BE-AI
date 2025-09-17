// 스프링 쪽으로 이관될 멘토 관련 인터페이스들

export interface Mentor {
  id: string;
  type: string;
  name: string;
  description: string;
  characteristics: MentorCharacteristics;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorCharacteristics {
  readonly name: string;
  readonly description: string;
  readonly advicePrompt: string;
  readonly goalPrompt: string;
}

export interface MentorResponse {
  id: string;
  type: string;
  name: string;
  description: string;
  isActive: boolean;
}

// 스프링 API에서 멘토 정보를 가져오는 인터페이스
export interface SpringMentorApiResponse {
  success: boolean;
  data: MentorResponse[];
  message?: string;
}

export interface SpringMentorApiRequest {
  mentorType?: string;
  isActive?: boolean;
}
