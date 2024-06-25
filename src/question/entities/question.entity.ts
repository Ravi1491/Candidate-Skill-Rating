import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';
import { DifficultyLevel } from 'src/utils/enum';

@Table({
  underscored: true,
})
export class Question extends Model<Question> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ allowNull: false })
  question: string;

  @Column({ allowNull: false })
  skillId: string;

  @Column({
    allowNull: false,
    type: DataType.ENUM,
    values: Object.values(DifficultyLevel),
  })
  difficultyLevel: DifficultyLevel;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
