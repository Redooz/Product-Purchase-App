import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    description: 'Email of the user',
    example: 'test@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  @MinLength(7)
  password: string;
}
