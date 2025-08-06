import { IsNotEmpty, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookImageDto {
  @ApiProperty({
    example: 'https://example.com/images/book123.jpg',
    description: 'Kitob rasmi URL manzili',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 5,
    description: 'Rasmga tegishli kitobning ID raqami',
  })
  @IsInt()
  @IsNotEmpty()
  bookId: number;
}
