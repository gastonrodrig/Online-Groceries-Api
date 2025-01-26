import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCartDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}