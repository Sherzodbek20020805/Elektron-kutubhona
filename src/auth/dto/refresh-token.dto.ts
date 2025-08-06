import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: 1,
    description: 'Foydalanuvchining ID raqami',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
