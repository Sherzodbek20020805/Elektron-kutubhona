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
    console.error('Foydalanuvchi yaratishda xatolik:', error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Bu email bilan foydalanuvchi allaqachon mavjud');
      }
      throw new BadRequestException(`Prisma xatosi: ${error.message}`);
    }

    throw new InternalServerErrorException('Foydalanuvchi yaratishda ichki xatolik yuz berdi');
  }
}


async createAdminUser() {
  const existing = await this.prisma.user.findFirst({
    where: { role: Role.ADMIN },
  });

  if (existing) {
    throw new ConflictException('Admin allaqachon mavjud');
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  return this.prisma.user.create({
    data: {
      email: 'admin2@example.com',
      password: hashedPassword,
      fullName: 'Admin User',
      role: Role.ADMIN,
    }
    ,
  });
}

  async findAll(query: {
    page?: string;
    limit?: string;
    role?: string;
    search?: string;
    isActive?: string;
  }) {
    try {
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
      if (query.isActive) filters.isActive = query.isActive === 'true';

      if (query.search) {
        filters.OR = [
          { fullName: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      const skip = (page - 1) * limit;

      const [users, total] = await this.prisma.$transaction([
        this.prisma.user.findMany({
          where: filters,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where: filters }),
      ]);

      return {
        data: users,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error('Foydalanuvchilarni olishda xatolik:', error);
      throw new InternalServerErrorException('Foydalanuvchilarni olishda xatolik yuz berdi');
    }
  }

  
  async updateRefreshToken(id: number, hashedRefreshToken: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new BadRequestException('Foydalanuvchi topilmadi');
      }

      return await this.prisma.user.update({
        where: { id },
        data: { refreshToken: hashedRefreshToken },
      });
    } catch (error) {
      return error;
    }
  }
  async findOne(id: number, currentUser?: { id: number; role: string }) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });

      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

      // currentUser undefined bo'lsa, default qiymat beriladi (masalan, admin yoki o'zi)
      if (!currentUser) {
        currentUser = { id, role: 'ADMIN' };
      }

      if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
        throw new ForbiddenException('Ruxsat yo‘q');
      }

      return user;
    } catch (error) {
      console.error('Foydalanuvchini olishda xatolik:', error);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      )
        throw error;

      throw new InternalServerErrorException('Foydalanuvchini olishda xatolik yuz berdi');
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

      return await this.prisma.user.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      console.error('Foydalanuvchini yangilashda xatolik:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Foydalanuvchini yangilashda xatolik yuz berdi');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');

      await this.prisma.user.delete({ where: { id } });
      return { message: 'Foydalanuvchi o‘chirildi' };
    } catch (error) {
      console.error('Foydalanuvchini o‘chirishda xatolik:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Foydalanuvchini o‘chirishda xatolik yuz berdi');
    }
  }
}
