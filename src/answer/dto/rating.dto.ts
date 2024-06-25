import { IsNumber, IsString, Max, Min } from 'class-validator';
export class CreateRatingDto {
  @IsString()
  answerId: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
