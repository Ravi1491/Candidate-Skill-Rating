import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { SkillService } from 'src/skill/skill.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { DifficultyLevel, UserRole } from 'src/utils/enum';
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

  @Post('/update')
  @Roles(UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  async update(
    @Body()
    updateQuestionDto: {
      id: string;
      skillId: string;
      question: string;
      difficultyLevel: DifficultyLevel;
    },
  ) {
    try {
      if (!updateQuestionDto.id) {
        throw new Error('Id is required');
      }

      const question = this.questionService.findOne({
        id: updateQuestionDto.id,
      });

      if (!question) {
        throw new Error('Question not found');
      }

      return this.questionService.update(
        { id: updateQuestionDto.id },
        updateQuestionDto,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/delete')
  @Roles(UserRole.REVIEWER)
  @UseGuards(RolesGuard)
  async delete(@Body() deleteQuestionDto: { id: string }) {
    try {
      if (!deleteQuestionDto.id) {
        throw new Error('Id is required');
      }

      const question = this.questionService.findOne({
        id: deleteQuestionDto.id,
      });

      if (!question) {
        throw new Error('Question not found');
      }

      return this.questionService.delete({ id: deleteQuestionDto.id });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/get-all')
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }
}
