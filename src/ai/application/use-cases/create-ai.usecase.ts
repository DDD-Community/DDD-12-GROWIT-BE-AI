import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateAiUseCase {
  constructor() {}

  async execute(_userId: string) {
    // TODO: AI 생성 로직 구현
    return {};
  }
}
