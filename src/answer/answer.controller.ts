import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/user/entities/user.entity';
import { QuestionService } from 'src/question/question.service';

@Controller('answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
  ) {}

  @Post('/')
  create(@Body() createAnswerDto: CreateAnswerDto, @CurrentUser() user: User) {
    try {
      if (!createAnswerDto.questionId) {
        throw new Error('QuestionId is required');
      }

      if (!createAnswerDto.answer) {
        throw new Error('Answer is required');
      }

      const question = this.questionService.findOne({
        id: createAnswerDto.questionId,
      });

      if (!question) {
        throw new Error('Question not found');
      }

      const existingAnswer = this.answerService.findOne({
        questionId: createAnswerDto.questionId,
        candidateId: user.id,
      });

      if (existingAnswer) {
        throw new Error('Answer already exist for this question by this user');
      }

      return this.answerService.create({
        questionId: createAnswerDto.questionId,
        answer: createAnswerDto.answer,
        candidateId: user.id,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  findAll() {
    return this.answerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(+id);
  }
}
