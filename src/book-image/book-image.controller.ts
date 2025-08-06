import {
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Body,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { BookImageService } from './book-image.service';
import { CreateBookImageDto } from './dto/create-book-image.dto';
import { UpdateBookImageDto } from './dto/update-book-image.dto';
import { JwtGuard, Roles, RolesGuard } from 'src/common';

@Controller('book-images')
// @UseGuards(JwtGuard, RolesGuard)
export class BookImageController {
  constructor(private readonly service: BookImageService) {}

  @Post()
  // @Roles('ADMIN')
  create(@Body() dto: CreateBookImageDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  // @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookImageDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  // @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
