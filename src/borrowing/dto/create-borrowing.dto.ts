import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { BorrowingStatus } from '@prisma/client';

export class CreateBorrowingDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  bookId: number;

  @IsDateString()
  @IsNotEmpty()
  fromDate: Date;

  @IsDateString()
  @IsNotEmpty()
  toDate: Date;

  @IsOptional()
@IsEnum(BorrowingStatus)
status?: BorrowingStatus;


  @IsOptional()
  @IsDateString()
  returnDate?: Date;
}
