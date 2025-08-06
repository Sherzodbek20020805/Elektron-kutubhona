import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { FileType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({
    example: 'kitob-rasmi.jpg',
    description: 'Fayl nomi',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://cdn.example.com/files/kitob-rasmi.jpg',
    description: 'Faylning to‘liq URL manzili',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    example: 'IMAGE',
    description: 'Fayl turi (IMAGE, PDF, AUDIO, VIDEO, ...)',
    enum: FileType,
  })
  @IsEnum(FileType)
  type: FileType;

  @ApiProperty({
    example: 204800,
    description: 'Fayl hajmi baytlarda (byte)',
  })
  @IsInt()
  size: number;
}
