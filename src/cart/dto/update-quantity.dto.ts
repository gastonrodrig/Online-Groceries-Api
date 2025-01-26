import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCartDto {
  @ApiProperty()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}