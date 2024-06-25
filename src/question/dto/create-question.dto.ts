import { DifficultyLevel } from 'src/utils/enum';

export class CreateQuestionDto {
  question: string;
  difficultyLevel: DifficultyLevel;
  skillId: string;
}
