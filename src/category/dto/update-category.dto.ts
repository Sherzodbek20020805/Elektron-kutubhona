// update-category.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: 'Kategoriya nomi', example: 'Badiiy' })
  @IsString()
  @IsOptional()
  name?: string;
}
