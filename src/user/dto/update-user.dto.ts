import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'gastonrodrig' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'Gaston Alonso Rodriguez Herrera' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  mobile: string;
}