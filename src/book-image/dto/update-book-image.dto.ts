import { PartialType } from '@nestjs/swagger';
import { CreateBookImageDto } from './create-book-image.dto';

export class UpdateBookImageDto extends PartialType(CreateBookImageDto) {}
