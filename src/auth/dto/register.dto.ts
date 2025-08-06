import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Foydalanuvchining elektron pochtasi',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Kamida 6 ta belgidan iborat parol',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Sherzodbek Yoldashev',
    description: 'Foydalanuvchining to‘liq ismi',
  })
  @IsNotEmpty()
  full_name: string;
}
