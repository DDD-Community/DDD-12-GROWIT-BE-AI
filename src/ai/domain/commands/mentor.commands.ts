// 스프링 쪽으로 이관될 멘토 관련 Command들

export interface GetMentorCommand {
  id?: string;
  type?: string;
}

export interface ListMentorsCommand {
  type?: string;
  isActive?: boolean;
  limit?: number;
  offset?: number;
}

export interface CreateMentorCommand {
  type: string;
  name: string;
  description: string;
  characteristics: MentorCharacteristics;
  isActive?: boolean;
}

export interface UpdateMentorCommand {
  id: string;
  name?: string;
  description?: string;
  characteristics?: MentorCharacteristics;
  isActive?: boolean;
}

export interface DeleteMentorCommand {
  id: string;
}

export interface MentorCharacteristics {
  readonly name: string;
  readonly description: string;
  readonly advicePrompt: string;
  readonly goalPrompt: string;
}
