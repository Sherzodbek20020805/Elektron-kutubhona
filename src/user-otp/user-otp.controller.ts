import { Controller, UseGuards, Post, Body, Get, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { UserOtpService } from './user-otp.service';
import { CreateUserOtpDto } from './dto/create-user-otp.dto';
import { UpdateUserOtpDto } from './dto/update-user-otp.dto';

import {Roles, AccessTokenGuard, RolesGuard } from '../common'; 


@UseGuards(AccessTokenGuard, RolesGuard)
@Roles('ADMIN')
@Controller('user-otp')
export class UserOtpController {
  constructor(private readonly service: UserOtpService) {}

  @Post()
  create(@Body() dto: CreateUserOtpDto) {
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
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserOtpDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
