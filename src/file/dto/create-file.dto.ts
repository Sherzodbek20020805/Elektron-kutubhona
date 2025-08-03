import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { FileType } from '@prisma/client';

export class CreateFileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsEnum(FileType)
  type: FileType;

  @IsInt()
  size: number;
}
