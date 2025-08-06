import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Badiiy',
    description: 'Kategoriya nomi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
