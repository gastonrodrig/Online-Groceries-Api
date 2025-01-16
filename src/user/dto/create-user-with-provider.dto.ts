import { IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserWithProviderDto {
  @ApiProperty({ description: 'Email of the user', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}