import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBestProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  productId: string;
}