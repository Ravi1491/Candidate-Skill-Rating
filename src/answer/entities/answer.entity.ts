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

@Table({
  underscored: true,
})
export class Answer extends Model<Answer> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ allowNull: false })
  questionId: string;

  @Column({ allowNull: false })
  candidateId: string;

  @Column({ allowNull: false })
  answer: string;

  @Column({ allowNull: true })
  rating: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
