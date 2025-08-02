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
import { JwtGuard,Roles, RolesGuard } from 'src/common';

@Controller('authors')
export class AuthorController {
  constructor(private readonly service: AuthorService) {}

  @Post()
  create(@Body() dto: CreateAuthorDto) {
    return this.service.create(dto);
  }

  @Get()
findAll(@Query() query: any) {
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

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Body('currentUser') currentUser: { role: string }
  ) {
    return this.service.remove(id, currentUser);
  }

}
