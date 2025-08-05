import { IsInt } from 'class-validator';

export class CreateBookAuthorDto {
  @IsInt()
  bookId: number;

  @IsInt()
  authorId: number;
}
