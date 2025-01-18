import { IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductReviewDto {
  @ApiProperty()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;
}