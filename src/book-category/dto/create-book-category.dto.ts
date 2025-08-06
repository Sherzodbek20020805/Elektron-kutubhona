import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookCategoryDto {
  @ApiProperty({
    example: 1,
    description: 'Bog‘lanayotgan kitobning ID raqami',
  })
  @IsInt()
  bookId: number;

  @ApiProperty({
    example: 2,
    description: 'Bog‘lanayotgan kategoriyaning ID raqami',
  })
  @IsInt()
  categoryId: number;
}
