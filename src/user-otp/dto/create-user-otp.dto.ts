import { IsEnum, IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { OtpStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserOtpDto {
  @ApiProperty({
    example: '123456',
    description: 'Foydalanuvchiga yuborilgan OTP kod',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: 1,
    description: 'Foydalanuvchi ID raqami (User jadvalidan)',
  })
  @IsInt()
  userId: number;

  @ApiProperty({
    example: 'ACTIVE',
    enum: OtpStatus,
    description: 'OTP holati (ACTIVE, VERIFIED, EXPIRED)',
  })
  @IsEnum(OtpStatus)
  status: OtpStatus;

  @ApiProperty({
    example: '2025-08-06T12:00:00.000Z',
    description: 'OTP amal qilish muddati (ISO 8601 formatda)',
  })
  @IsDateString()
  expiresAt: string;
}
