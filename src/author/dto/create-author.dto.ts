import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({
    example: 'Chingiz Aytmatov',
    description: 'Muallifning to‘liq ismi',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({
    example: 'Mashhur qirg‘iz yozuvchisi va jamoat arbobi.',
    description: 'Muallif haqida qisqacha biografiya (ixtiyoriy)',
  })
  @IsString()
  @IsOptional()
  bio?: string;
}
