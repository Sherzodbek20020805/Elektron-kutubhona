import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({
    example: 'O‘tkan kunlar',
    description: 'Kitob nomi',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Bu kitob o‘zbek adabiyotining durdonasi.',
    description: 'Kitob haqida qisqacha tavsif (ixtiyoriy)',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 1,
    description: 'Muallif ID raqami (Author jadvalidan)',
  })
  @IsInt()
  @IsNotEmpty()
  authorId: number;

  @ApiProperty({
    example: 2,
    description: 'Kategoriya ID raqami (Category jadvalidan)',
  })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @ApiPropertyOptional({
    example: 2020,
    description: 'Nashr yili (ixtiyoriy)',
  })
  @IsInt()
  @IsOptional()
  year?: number;
}
