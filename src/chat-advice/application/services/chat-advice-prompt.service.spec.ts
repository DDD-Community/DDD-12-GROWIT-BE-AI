import { FourPillarsDto } from '@/forceteller/domain/four-pillars.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { AdviceMode } from '../../../common/enums/advice-mode.enum';
import { ChatAdvicePromptService } from './chat-advice-prompt.service';

describe('ChatAdvicePromptService', () => {
  let service: ChatAdvicePromptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatAdvicePromptService],
    }).compile();

    service = module.get<ChatAdvicePromptService>(ChatAdvicePromptService);
  });

  const mockSaju: FourPillarsDto = {
    year: '甲辰',
    month: '丙寅',
    day: '丁卯',
    hour: '戊辰',
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateRealtimeAdvicePrompt', () => {
    it('should generate SAJU mode prompt with manseRyok data', () => {
      const mode = AdviceMode.사주;
      const goalTitle = 'Make a cool app';
      const concern = 'I am lazy';
      const recentTodos = ['Design DB', 'Setup NestJS'];

      const prompt = service.generateRealtimeAdvicePrompt(
        goalTitle,
        concern,
        mode,
        recentTodos,
        mockSaju,
      );

      expect(prompt).toContain(
        '당신은 사용자의 사주팔자(만세력)를 보고 현재 운세를 기반으로 조언해주는 신비로운 AI 점술가 그로롱입니다.',
      );
      expect(prompt).toContain(`년주: ${mockSaju.year}`);
      expect(prompt).toContain(`월주: ${mockSaju.month}`);
      expect(prompt).toContain(`유저가 선택한 목표: ${goalTitle}`);
      expect(prompt).toContain(`전송한 고민: ${concern}`);
      expect(prompt).toContain(
        `선택한 목표의 최근 7일 투두 리스트: ${recentTodos.join(', ')}`,
      );
    });

    it('should generate SAJU mode prompt without manseRyok data (fallback)', () => {
      const mode = AdviceMode.사주;
      const goalTitle = 'Make a cool app';
      const concern = 'I am lazy';
      const recentTodos = ['Design DB', 'Setup NestJS'];

      const prompt = service.generateRealtimeAdvicePrompt(
        goalTitle,
        concern,
        mode,
        recentTodos,
        undefined,
      );

      expect(prompt).toContain('만세력(사주팔자): 정보 없음');
      expect(prompt).toContain(
        '만약 만세력 정보가 없다면, 일반적인 운세의 흐름이나 기운을 언급하며 자연스럽게 조언해주세요.',
      );
    });
  });

  describe('generateOnboardingPrompt', () => {
    it('should generate SAJU onboarding prompt with manseRyok', () => {
      const mode = AdviceMode.사주;
      const goalTitle = 'Start Business';
      const concern = 'Will I succeed?';

      const prompt = service.generateOnboardingPrompt(
        goalTitle,
        concern,
        mode,
        mockSaju,
      );

      expect(prompt).toContain(
        '당신은 사용자의 사주팔자(만세력)를 보고 조언해주는 신비로운 AI 점술가 그로롱입니다.',
      );
      expect(prompt).toContain(`년주: ${mockSaju.year}`);
      expect(prompt).toContain(`선택한 목표: ${goalTitle}`);
      expect(prompt).toContain(`전송한 고민: ${concern}`);
    });
  });

  describe('generateMorningAdvicePrompt (Daily Fortune)', () => {
    it('should generate Daily Fortune prompt with manseRyok', () => {
      const goalTitles = ['Exercise', 'Reading'];
      const recentTodos = ['Run 5km', 'Read 1 chapter'];
      const previousConversations = 'Yesterday was good.';

      const prompt = service.generateMorningAdvicePrompt(
        goalTitles,
        recentTodos,
        previousConversations,
        mockSaju,
      );

      expect(prompt).toContain(
        '당신은 사용자의 사주팔자(만세력)를 보고 오늘의 운세를 기반으로 조언해주는 신비로운 AI 점술가 그로롱입니다.',
      );
      expect(prompt).toContain(`년주: ${mockSaju.year}`);
      expect(prompt).toContain('오늘 운세를 상세하게 분석 및 설명');
    });

    it('should generate original Morning Advice prompt without manseRyok', () => {
      const goalTitles = ['Exercise'];
      const recentTodos = [];
      const previousConversations = '';

      const prompt = service.generateMorningAdvicePrompt(
        goalTitles,
        recentTodos,
        previousConversations,
        undefined,
      );

      expect(prompt).toContain(
        '당신은 사용자의 아침을 활기차게 열어주는 AI 멘토입니다.',
      );
      expect(prompt).not.toContain('만세력');
      expect(prompt).toContain(
        '아침을 반기는 귀엽고 힘이 되는 참신한 말 한마디',
      );
    });
  });
});
