import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookCategoryDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  bookId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  categoryId: number;
}
