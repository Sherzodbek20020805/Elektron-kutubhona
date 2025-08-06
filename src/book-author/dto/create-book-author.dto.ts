import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookAuthorDto {
  @ApiProperty({
    example: 1,
    description: 'Bog‘lanayotgan kitobning ID raqami',
  })
  @IsInt()
  bookId: number;

  @ApiProperty({
    example: 3,
    description: 'Bog‘lanayotgan muallifning ID raqami',
  })
  @IsInt()
  authorId: number;
}
