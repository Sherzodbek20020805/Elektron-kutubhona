import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class AuthorFilterDto {
  @ApiPropertyOptional({ description: 'Qidiruv uchun muallif ismi' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Sahifa raqami', example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ description: 'Har sahifadagi elementlar soni', example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
