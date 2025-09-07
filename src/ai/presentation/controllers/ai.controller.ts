import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AiService } from '../../application/use-cases/ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}
}
