import { IsEnum, IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { OtpStatus } from '@prisma/client';

export class CreateUserOtpDto {
  @IsString()
  @IsNotEmpty()
  code: string; 

  @IsInt()
  userId: number;

  @IsEnum(OtpStatus)
  status: OtpStatus;

  @IsDateString()
  expiresAt: string;
}
