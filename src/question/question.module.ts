import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Question } from './entities/question.entity';
import { SkillModule } from 'src/skill/skill.module';

@Module({
  imports: [SequelizeModule.forFeature([Question]), SkillModule],
  controllers: [QuestionController],
  providers: [QuestionService],
  exports: [QuestionService],
})
export class QuestionModule {}
