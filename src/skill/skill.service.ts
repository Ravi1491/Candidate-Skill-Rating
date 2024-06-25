import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill)
    private SkillModel: typeof Skill,
  ) {}

  create(createSkillInput: CreateSkillDto) {
    return this.SkillModel.create(createSkillInput);
  }

  findOne(payload = {}, options = {}) {
    return this.SkillModel.findOne({
      where: payload,
      ...options,
    });
  }

  findAll(payload = {}, options = {}) {
    return this.SkillModel.findAll({
      where: payload,
      ...options,
    });
  }

  async delete(condition = {}) {
    return this.SkillModel.destroy({
      where: condition,
    });
  }

  async findAndCountAll(payload = {}, options = {}) {
    const { count, rows } = await this.SkillModel.findAndCountAll({
      where: payload,
      ...options,
    });

    return { total: count, rows };
  }
}
