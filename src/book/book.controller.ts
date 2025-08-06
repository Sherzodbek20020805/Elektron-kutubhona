import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { AccessTokenGuard, JwtGuard, Roles, RolesGuard } from 'src/common';
import { ApiQuery } from '@nestjs/swagger';
import { FindAllBooksQueryDto } from './dto/get_dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {} 

  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles('ADMIN', 'MANAGER')
  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.bookService.create(dto);
  }


 @Get()
findAll(@Query() query: FindAllBooksQueryDto) {
  return this.bookService.findAll({
    search: query.search,
    page: query.page?.toString(),
    limit: query.limit?.toString(),
  });
}




  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.findOne(id);
  }

  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles('ADMIN', 'MANAGER')
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBookDto) {
    return this.bookService.update(id, dto);
  }

  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bookService.remove(id);
  }
}
