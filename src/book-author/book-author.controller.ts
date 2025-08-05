import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { BookAuthorService } from './book-author.service';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('BookAuthor')
@Controller('book-authors')
export class BookAuthorController {
  constructor(private readonly service: BookAuthorService) {}

  @Post()
  @ApiOperation({ summary: 'Kitobga muallif biriktirish' })
  create(@Body() dto: CreateBookAuthorDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha kitob-mualliflar ro‘yxati' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha kitob-muallif topish' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Kitob-muallif ma’lumotini o‘zgartirish' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookAuthorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Kitob-muallifni o‘chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
