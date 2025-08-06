import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class FindAllBooksQueryDto {
  @ApiPropertyOptional({
    description: 'Kitob sarlavhasi bo‘yicha qidiruv',
    example: 'JavaScript',
  })
  @IsOptional()
  @IsString()
  search!: string;

  @ApiPropertyOptional({
    description: 'Sahifa raqami',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Har sahifada nechta natija ko‘rsatiladi',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
