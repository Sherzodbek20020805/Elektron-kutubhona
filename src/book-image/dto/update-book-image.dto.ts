import { PartialType } from '@nestjs/mapped-types';
import { CreateBookImageDto } from './create-book-image.dto';

export class UpdateBookImageDto extends PartialType(CreateBookImageDto) {}
