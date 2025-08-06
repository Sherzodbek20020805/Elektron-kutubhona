import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { BorrowingStatus } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBorrowingDto {
  @ApiProperty({
    example: 3,
    description: 'Foydalanuvchi ID raqami',
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 7,
    description: 'Kitob ID raqami',
  })
  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @ApiProperty({
    example: '2025-08-06T00:00:00.000Z',
    description: 'Kitobni olish sanasi (ISO 8601 formatda)',
  })
  @IsDateString()
  @IsNotEmpty()
  fromDate: string; // `string` bo'lishi kerak, chunki swagger `ISO` formatni string ko‘rinishida oladi

  @ApiProperty({
    example: '2025-08-20T00:00:00.000Z',
    description: 'Kitobni qaytarish sanasi (ISO 8601 formatda)',
  })
  @IsDateString()
  @IsNotEmpty()
  toDate: string;

  @ApiPropertyOptional({
    example: 'RETURNED',
    description: 'Ijara statusi (BORROWED, RETURNED, OVERDUE)',
    enum: BorrowingStatus,
  })
  @IsOptional()
  @IsEnum(BorrowingStatus)
  status?: BorrowingStatus;

  @ApiPropertyOptional({
    example: '2025-08-19T00:00:00.000Z',
    description: 'Kitob qaytarilgan sana (agar qaytarilgan bo‘lsa)',
  })
  @IsOptional()
  @IsDateString()
  returned?: string;
}
