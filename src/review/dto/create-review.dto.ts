import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({
    example: 1,
    description: 'Foydalanuvchining ID raqami',
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 5,
    description: 'Kitobning ID raqami',
  })
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @ApiProperty({
    example: 4,
    description: 'Baholash (1 dan 5 gacha)',
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    example: 'Juda zoʻr kitob!',
    description: 'Foydalanuvchining ixtiyoriy izohi',
  })
  @IsString()
  @IsOptional()
  comment?: string;
}
