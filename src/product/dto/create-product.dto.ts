import { IsString, IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  brandId: string;

  @IsString()
  @IsNotEmpty()
  unit_name: string;

  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  @IsNotEmpty()
  unit_value: string;

  @IsString()
  @IsNotEmpty()
  nutrition_weight: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  rating: 0;

  review_count: 0;
}
