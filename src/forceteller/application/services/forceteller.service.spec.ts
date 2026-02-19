import { Test, TestingModule } from '@nestjs/testing';
import { ForcetellerApiClient } from '../../infrastructure/forceteller-api.client';
import { ForceTellerSajuResponse } from '../../presentation/dto/saju-response.interface';
import { ForcetellerService } from './forceteller.service';

const mockResponse: ForceTellerSajuResponse = {
  status: 200,
  data: {
    bitmap: 203762949,
    _기본명식: {
      _세차: {
        _천간: { id: 2, name: '병', chinese: '丙' },
        _지지: { id: 0, name: '자', chinese: '子' },
        _지장간: [],
        _운성: { id: 9, name: '절', chinese: '絶' },
      },
      _월건: {
        _천간: { id: 7, name: '신', chinese: '辛' },
        _지지: { id: 1, name: '축', chinese: '丑' },
        _지장간: [],
        _운성: { id: 8, name: '묘', chinese: '墓' },
      },
      _일진: {
        _천간: { id: 5, name: '기', chinese: '己' },
        _지지: { id: 9, name: '유', chinese: '酉' },
        _지장간: [],
        _운성: { id: 0, name: '장생', chinese: '長生' },
      },
      _시진: {
        _천간: { id: 5, name: '기', chinese: '己' },
        _지지: { id: 5, name: '사', chinese: '巳' },
        _지장간: [],
        _운성: { id: 4, name: '제왕', chinese: '帝旺' },
      },
    },
  },
};

describe('ForcetellerService', () => {
  let service: ForcetellerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForcetellerService,
        {
          provide: ForcetellerApiClient,
          useValue: {
            getSajuChart: jest.fn().mockResolvedValue(mockResponse),
          },
        },
      ],
    }).compile();

    service = module.get<ForcetellerService>(ForcetellerService);
  });

  it('should extract four pillars correctly', async () => {
    const result = await service.getSajuFourPillars({
      name: '홍길동',
      gender: 'MALE',
      calendar: 'S',
      birthday: '1990/01/01',
      birthtime: '12:00',
      hmUnsure: false,
      midnightAdjust: false,
      year: 1990,
      month: 1,
      day: 1,
      hour: 12,
      min: 0,
    });

    expect(result.year).toBe('병자(丙子)');
    expect(result.month).toBe('신축(辛丑)');
    expect(result.day).toBe('기유(己酉)');
    expect(result.hour).toBe('기사(己巳)');
  });
});
