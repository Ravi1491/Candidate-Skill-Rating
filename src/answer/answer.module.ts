import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Answer } from './entities/answer.entity';
import { UserModule } from 'src/user/user.module';
import { QuestionModule } from 'src/question/question.module';
import { SkillModule } from 'src/skill/skill.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Answer]),
    UserModule,
    QuestionModule,
    SkillModule,
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
})
export class AnswerModule {}
