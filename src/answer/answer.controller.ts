import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/user/entities/user.entity';
import { QuestionService } from 'src/question/question.service';
import { CreateRatingDto } from './dto/rating.dto';
import { DifficultyLevel, UserRole } from 'src/utils/enum';
import { SkillService } from 'src/skill/skill.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles';

@Controller('answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
    private readonly skillService: SkillService,
  ) {}

  @Post('/create')
  @Roles(UserRole.CANDIDATE)
  @UseGuards(RolesGuard)
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
  @Roles(UserRole.REVIEWER)
  @UseGuards(RolesGuard)
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

  @Get('/aggregate/skills')
  @Roles(UserRole.REVIEWER, UserRole.CANDIDATE)
  @UseGuards(RolesGuard)
  async getAggregateSkills(@Query('candidateId') candidateId: string) {
    try {
      const answers = await this.answerService.findAllByCandidate(candidateId);

      const skillRatings = await answers.reduce(async (accPromise, answer) => {
        const acc = await accPromise;
        const question = await this.questionService.findOne({
          id: answer.questionId,
        });

        const { rating } = answer;
        const { skillId, difficultyLevel } = question;

        const skill = await this.skillService.findOne({ id: skillId });

        if (!acc[skillId]) {
          acc[skillId] = { totalRating: 0, totalWeight: 0 };
        }

        const weight =
          difficultyLevel === DifficultyLevel.EASY
            ? 1
            : difficultyLevel === DifficultyLevel.MEDIUM
              ? 2
              : 3;

        acc[skillId].totalRating += rating * weight;
        acc[skillId].totalWeight += weight;
        acc[skillId].skillName = skill.name;

        return acc;
      }, Promise.resolve({}));

      const aggregateRatings = Object.keys(skillRatings).map((skillId) => ({
        skillId: skillId,
        skillName: skillRatings[skillId].skillName,
        rating:
          skillRatings[skillId].totalRating / skillRatings[skillId].totalWeight,
      }));

      return aggregateRatings;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
