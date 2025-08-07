import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Validated } from './../valided/validet';
import { Public } from 'src/common';
import { GetUsersDto } from './dto/get-users.dto';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Foydalanuvchi yaratish' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Public()
  @Post('create-admin')
  createAdmin() {
    return this.userService.createAdminUser();
  }

  @Get()
  @ApiOperation({ summary: 'Foydalanuvchilar ro‘yxati (filtrlash va pagination)' })
  getUsers(@Query() query: GetUsersDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta foydalanuvchini olish' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: { currentUser?: { id: number; role: string } },
  ) {
    // Agar currentUser undefined bo'lsa, default qiymat beriladi (masalan, admin yoki o'zi)
    const currentUser = query.currentUser ?? { id, role: 'ADMIN' };
    return this.userService.findOne(id, currentUser);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Foydalanuvchini tahrirlash' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Foydalanuvchini o‘chirish' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
