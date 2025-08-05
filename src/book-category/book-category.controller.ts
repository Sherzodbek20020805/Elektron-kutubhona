import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Headers,
} from '@nestjs/common';
import { BookCategoryService } from './book-category.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('book-category')
@ApiTags('BookCategory')
export class BookCategoryController {
  constructor(private readonly service: BookCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi bogʻlanma yaratish' })
  create(@Body() dto: CreateBookCategoryDto, @Headers('accept-language') lang: string) {
    return this.service.create(dto, lang);
  }

  @Get()
  @ApiOperation({ summary: 'Bogʻlanmalar roʻyxati' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID bo‘yicha bogʻlanmani olish' })
  findOne(@Param('id', ParseIntPipe) id: number, @Headers('accept-language') lang: string) {
    return this.service.findOne(id, lang);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Bogʻlanmani tahrirlash' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookCategoryDto,
    @Headers('accept-language') lang: string,
  ) {
    return this.service.update(id, dto, lang);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Bogʻlanmani oʻchirish' })
  remove(@Param('id', ParseIntPipe) id: number, @Headers('accept-language') lang: string) {
    return this.service.remove(id, lang);
  }
}
