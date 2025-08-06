import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';
import { Role } from '@prisma/client';

export class GetUsersDto {
  @ApiPropertyOptional({ example: '1', description: 'Sahifa raqami' })
  @IsOptional()
  @IsNumberString({}, { message: 'Page raqami son bo‘lishi kerak' })
  page?: string;

  @ApiPropertyOptional({ example: '10', description: 'Har bir sahifadagi elementlar soni' })
  @IsOptional()
  @IsNumberString({}, { message: 'Limit raqami son bo‘lishi kerak' })
  limit?: string;

  @ApiPropertyOptional({ example: 'ADMIN', enum: Role, description: 'Foydalanuvchi roli' })
  @IsOptional()
  @IsEnum(Role, { message: 'Role faqat USER yoki ADMIN bo‘lishi mumkin' })
  role?: Role;

  @ApiPropertyOptional({ example: 'true', description: 'Foydalanuvchi faolligi (true/false)' })
  @IsOptional()
  @IsString()
  isActive?: string;

  @ApiPropertyOptional({ example: 'ali', description: 'Ism yoki email bo‘yicha qidiruv' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Qidiruv kamida 2 ta belgidan iborat bo‘lishi kerak' })
  search?: string;
}
