import { MentorType } from '../value-objects/mentor-type.vo';

export interface PromptInfo {
  type: string;
  mentorType: MentorType | null;
}

export interface PromptInfoService {
  getPromptInfoByPromptId(promptId: string): Promise<PromptInfo | null>;
}
