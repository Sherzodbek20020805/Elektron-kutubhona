import { IsNotEmpty, IsInt, IsString } from 'class-validator';

export class CreateBookImageDto {
  @IsString()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @IsNotEmpty()
  bookId: number;
}
