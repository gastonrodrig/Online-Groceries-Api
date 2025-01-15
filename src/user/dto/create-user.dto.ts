import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'gastonrodrig' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Email of the user', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}