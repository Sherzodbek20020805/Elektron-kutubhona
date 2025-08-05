import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
async create(dto: CreateUserDto) {
  try {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullName: dto.fullName,
        role: dto.role ?? Role.USER,
      },
    });
  } catch (error) {
    // Prisma xatoliklarini ajratish
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Unique constraint error
        throw new ConflictException('Bu email bilan foydalanuvchi allaqachon mavjud');
      }

      // Boshqa tanilgan prisma xatolari
      throw new BadRequestException(`Prisma xatosi: ${error.message}`);
    }

    // Nomalum yoki ichki xatolik
    throw new InternalServerErrorException('Serverda xatolik yuz berdi');
  }
}



findAll(query: {
  page?: string;
  limit?: string;
  role?: string;
  search?: string;
  isActive?: string;
}) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;

  if (isNaN(page) || isNaN(limit)) {
    throw new BadRequestException('Page yoki limit noto‘g‘ri');
  }

  if (limit > 100) {
    throw new BadRequestException('Limit 100 tadan oshmasligi kerak');
  }

  if (query.role && !['ADMIN', 'USER'].includes(query.role)) {
    throw new BadRequestException('Role noto‘g‘ri');
  }

  if (query.isActive && !['true', 'false'].includes(query.isActive)) {
    throw new BadRequestException('isActive qiymati noto‘g‘ri');
  }

  if (query.search && query.search.length < 2) {
    throw new BadRequestException('Search so‘rovi kamida 2 ta belgidan iborat bo‘lishi kerak');
  }

  const filters: any = {};
  if (query.role) filters.role = query.role;
  if (query.isActive) filters.is_active = query.isActive === 'true';

  if (query.search) {
    filters.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const skip = (page - 1) * limit;

  return this.prisma.user.findMany({
    where: filters,
    skip,
    take: limit,
    orderBy: { createdAt: 'desc' },
  });
}


async findOne(id: number, currentUser: { id: number; role: string }) {
  const user = await this.prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

  if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
    throw new ForbiddenException('Ruxsat yo‘q');
  }

  return user;
}

 async update(id: number, dto: UpdateUserDto) {
  const user = await this.prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException('Foydalanuvchi topilmadi');
  }

  return this.prisma.user.update({
    where: { id },
    data: dto,
  });
}


  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundException('Foydalanuvchi topilmadi');
  }
  return await this.prisma.user.delete({ where: { id } });

  }
}
