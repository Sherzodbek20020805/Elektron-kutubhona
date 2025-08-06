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
    example: '2025-08-06',
    description: 'Kitobni olish sanasi (ISO formatda)',
  })
  @IsDateString()
  @IsNotEmpty()
  fromDate: Date;

  @ApiProperty({
    example: '2025-08-20',
    description: 'Kitobni qaytarish sanasi (ISO formatda)',
  })
  @IsDateString()
  @IsNotEmpty()
  toDate: Date;

  @ApiPropertyOptional({
    example: 'RETURNED',
    description: 'Ijara statusi (BORROWED, RETURNED, LATE, ...)',
    enum: BorrowingStatus,
  })
  @IsOptional()
  @IsEnum(BorrowingStatus)
  status?: BorrowingStatus;

  @ApiPropertyOptional({
    example: '2025-08-19',
    description: 'Kitob qaytarilgan sana (agar qaytarilgan bo‘lsa)',
  })
  @IsOptional()
  @IsDateString()
  returnDate?: Date;
}
