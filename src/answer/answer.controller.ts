import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/user/entities/user.entity';
import { QuestionService } from 'src/question/question.service';
import { CreateRatingDto } from './dto/rating.dto';
import { DifficultyLevel } from 'src/utils/enum';

@Controller('answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
  ) {}

  @Post('/create')
  async create(
    @Body() createAnswerDto: CreateAnswerDto,
    @CurrentUser() user: User,
  ) {
    try {
      if (!createAnswerDto.questionId) {
        throw new Error('QuestionId is required');
      }

      if (!createAnswerDto.answer) {
        throw new Error('Answer is required');
      }

      const question = await this.questionService.findOne({
        id: createAnswerDto.questionId,
      });

      if (!question) {
        throw new Error('Question not found');
      }

      const existingAnswer = await this.answerService.findOne({
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

  @Post('/give-rating')
  async giveRating(@Body() body: CreateRatingDto) {
    try {
      if (!body.answerId) {
        throw new Error('AnswerId is required');
      }

      if (!body.rating) {
        throw new Error('Rating is required');
      }

      const answer = await this.answerService.findOne({ id: body.answerId });

      if (!answer) {
        throw new Error('Answer not found');
      }

      const updatedAnswer = await this.answerService.update(
        { id: body.answerId },
        { rating: body.rating },
      );

      return updatedAnswer[1][0];
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

  @Get('/aggregate/skills')
  async getAggregateSkills(@Query('candidateId') candidateId: string) {
    try {
      const answers = await this.answerService.findAllByCandidate(candidateId);

      let numerator = 0;
      let denominator = 0;

      await Promise.all(
        answers.map(async (answer) => {
          const question = await this.questionService.findOne({
            id: answer.questionId,
          });

          const { rating } = answer;
          const { difficultyLevel } = question;

          const weight =
            difficultyLevel === DifficultyLevel.EASY
              ? 1
              : difficultyLevel === DifficultyLevel.MEDIUM
                ? 2
                : 3;

          numerator += rating * weight;
          denominator += weight;
        }),
      );

      const aggregateRatings = numerator / denominator;

      return Math.round(aggregateRatings * 100) / 100;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
