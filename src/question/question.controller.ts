import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SkillService } from 'src/skill/skill.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/utils/enum';
import { Roles } from 'src/auth/decorators/roles';

@Controller('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly skillService: SkillService,
  ) {}

  @Post('/create')
  @Roles(UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  create(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      if (!createQuestionDto.skillId) {
        throw new Error('SkillId is required');
      }

      const skill = this.skillService.findOne({
        id: createQuestionDto.skillId,
      });

      if (!skill) {
        throw new Error('Skill not found');
      }

      return this.questionService.create(createQuestionDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }
}
