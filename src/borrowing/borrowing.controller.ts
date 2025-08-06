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
import { BorrowingService } from './borrowing.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { UpdateBorrowingDto } from './dto/update-borrowing.dto';
import { JwtGuard, Roles, RolesGuard } from 'src/common';

@Controller('borrowings')
// @UseGuards(JwtGuard, RolesGuard)
export class BorrowingController {
  constructor(private readonly service: BorrowingService) {}

  @Post()
  // @Roles('USER', 'ADMIN')
  create(@Body() dto: CreateBorrowingDto) {
    return this.service.create(dto);
  }

  @Get()
  // @Roles('ADMIN')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  // @Roles('ADMIN', 'USER')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  // @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBorrowingDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  // @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
