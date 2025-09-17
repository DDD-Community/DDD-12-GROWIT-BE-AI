import { Inject, Injectable, Logger } from '@nestjs/common';
import { AdviceAggregate } from '../../domain/advice.domain';
import { AdviceRepository } from '../../domain/advice.repository';
import { AdviceDomainService } from '../../domain/services/advice.domain.service';
import { MentorTypeVO } from '../../domain/value-objects';
import { GenerateAdviceCommand } from '../commands/generate-advice.command';

export interface GenerateAdviceResult {
  success: boolean;
  entity: AdviceAggregate | null;
  error?: string;
}

@Injectable()
export class GenerateAdviceUseCase {
  private readonly logger = new Logger(GenerateAdviceUseCase.name);

  constructor(
    @Inject('AdviceRepository')
    private readonly adviceRepository: AdviceRepository,
    private readonly adviceDomainService: AdviceDomainService,
  ) {}

  async execute(command: GenerateAdviceCommand): Promise<GenerateAdviceResult> {
    this.logger.log(
      `Generating advice for user ${command.userId} with mentor ${command.mentorType}`,
    );

    try {
      // 도메인 서비스 호출 (AI 생성 로직 포함)
      const domainResult = await this.adviceDomainService.generateAdvice({
        userId: command.userId,
        promptId: command.promptId,
        input: {
          mentorType: MentorTypeVO.create(command.mentorType),
          recentTodos: command.recentTodos,
          weeklyRetrospects: command.weeklyRetrospects,
          overallGoal: command.overallGoal,
        },
      });

      if (!domainResult.success) {
        this.logger.error(
          `Domain validation failed for user ${command.userId}: ${domainResult.error}`,
        );
        return domainResult;
      }

      // 엔티티 저장
      await this.adviceRepository.save(domainResult.entity);

      this.logger.log(
        `Successfully generated advice for user ${command.userId}`,
      );

      return domainResult;
    } catch (error) {
      this.logger.error(
        `Failed to generate advice for user ${command.userId}: ${error.message}`,
      );

      // AI 실패 시 에러 응답 반환 (엔티티 저장하지 않음)
      return {
        success: false,
        entity: null,
        error: `AI service failed: ${error.message}`,
      };
    }
  }
}
