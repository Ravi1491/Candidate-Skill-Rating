import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Question } from './entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { DifficultyLevel } from 'src/utils/enum';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel(Question)
    private questionModel: typeof Question,
  ) {}

  create(createQuestionInput: CreateQuestionDto) {
    return this.questionModel.create(createQuestionInput);
  }

  findOne(payload = {}, options = {}) {
    return this.questionModel.findOne({
      where: payload,
      ...options,
    });
  }

  findAll(payload = {}, options = {}) {
    return this.questionModel.findAll({
      where: payload,
      ...options,
    });
  }

  async delete(condition = {}) {
    return this.questionModel.destroy({
      where: condition,
    });
  }

  async findAndCountAll(payload = {}, options = {}) {
    const { count, rows } = await this.questionModel.findAndCountAll({
      where: payload,
      ...options,
    });

    return { total: count, rows };
  }

  async update(
    condition = {},
    payload: {
      skillId: string;
      question: string;
      difficultyLevel: DifficultyLevel;
    },
    options = {},
  ) {
    return this.questionModel.update(payload, {
      where: condition,
      ...options,
      returning: true,
    });
  }
}
