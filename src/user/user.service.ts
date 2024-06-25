import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  create(createUserInput: CreateUserDto) {
    return this.userModel.create(createUserInput);
  }

  findOne(payload = {}, options = {}) {
    return this.userModel.findOne({
      where: payload,
      ...options,
    });
  }

  findAll(payload = {}, options = {}) {
    return this.userModel.findAll({
      where: payload,
      ...options,
    });
  }

  async delete(condition = {}) {
    return this.userModel.destroy({
      where: condition,
    });
  }

  async findAndCountAll(payload = {}, options = {}) {
    const { count, rows } = await this.userModel.findAndCountAll({
      where: payload,
      ...options,
    });

    return { total: count, rows };
  }
}
