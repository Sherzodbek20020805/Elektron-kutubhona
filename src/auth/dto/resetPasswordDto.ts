import { IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Parolni tiklash tokeni',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Yangi parol (kamida 6 ta belgidan iborat)',
    example: 'newsecurepassword',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Parolni tasdiqlash (password bilan bir xil bo‘lishi kerak)',
    example: 'newsecurepassword',
  })
  @IsString()
  confirmPassword: string;
}
