import { IsString, IsNotEmpty, Min, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  @IsNotEmpty()
  price: number;

  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  @IsNotEmpty()
  offer_price: number;

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

  @Transform(({ value }) => parseInt(value))
  @Min(0)
  @IsNotEmpty()
  is_fav: number;
}
