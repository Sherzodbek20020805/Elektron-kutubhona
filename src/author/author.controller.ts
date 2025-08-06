import {
  Controller,
  Post,
  Get,
  Patch,
  Query,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthorService } from './author.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { AccessTokenGuard, JwtGuard,Roles, RolesGuard } from 'src/common';
import { ApiQuery } from '@nestjs/swagger';
import { AuthorFilterDto } from './dto/author-filter.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly service: AuthorService) {}

  @Post()
  create(@Body() dto: CreateAuthorDto) {
    return this.service.create(dto);
  }

@Get()
// @Roles('ADMIN', 'USER')
// @UseGuards(AccessTokenGuard, RolesGuard)
@ApiQuery({ name: 'search', required: false, type: String })
@ApiQuery({ name: 'page', required: false, type: String })
@ApiQuery({ name: 'limit', required: false, type: String })
findAll(@Query() query: AuthorFilterDto) {
  return this.service.findAll(query);
}


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAuthorDto,
  ) {
    return this.service.update(id, dto);
  }

  // @UseGuards(JwtGuard, RolesGuard)
  // @Roles('ADMIN')
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Body('currentUser') currentUser: { role: string }
  ) {
    return this.service.remove(id, currentUser);
  }

}
