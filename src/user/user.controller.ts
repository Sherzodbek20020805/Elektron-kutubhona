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

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Foydalanuvchi yaratish' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha foydalanuvchilarni olish' })
  getAllUsers(
    @Query()
    query: {
      page?: string;
      limit?: string;
      role?: string;
      search?: string;
      isActive?: string;
    },
  ): any {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta foydalanuvchini olish' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: { currentUser: { id: number; role: string } },
  ) {
    return this.userService.findOne(id, query.currentUser);
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
