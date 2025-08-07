import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Role } from '@prisma/client';



export class CreateUserDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'Foydalanuvchi email manzili (unique)',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'Parol kamida 6 ta belgidan iborat bo‘lishi kerak',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'Sherzodbek Yoldashev',
    description: 'Foydalanuvchi to‘liq ismi',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({
    example: 'ADMIN',
    enum: Role,
    description: 'Foydalanuvchi roli (USER yoki ADMIN)',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Role noto‘g‘ri (USER yoki ADMIN)' })
  role?: Role;
}
