import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNutritionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nutrition_name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nutrition_value: string;
}
