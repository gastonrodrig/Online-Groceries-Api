import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'gastonrodrig' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Full name of the user', example: 'Gaston Alonso Rodriguez Herrera' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Email of the user', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Mobile number of the user', example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  mobile: string;
}