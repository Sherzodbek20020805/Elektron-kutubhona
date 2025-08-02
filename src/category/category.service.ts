import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findFirst({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException('Bunday kategoriya mavjud');
    }

    try {
      return await this.prisma.category.create({ data: dto });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Kategoriya yaratishda xatolik');
    }
  }

  async findAll(query: { search?: string; page?: string; limit?: string }) {
    let { search, page = '1', limit = '10' } = query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      throw new BadRequestException('page yoki limit noto‘g‘ri kiritilgan');
    }

    if (pageNumber < 1 || limitNumber < 1) {
      throw new BadRequestException('page va limit musbat son bo‘lishi kerak');
    }

    if (search && search.length > 100) {
      throw new BadRequestException('Qidiruv so‘rovi juda uzun');
    }

    const skip = (pageNumber - 1) * limitNumber;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where: search
          ? { name: { contains: search, mode: 'insensitive' } }
          : undefined,
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count({
        where: search
          ? { name: { contains: search, mode: 'insensitive' } }
          : undefined,
      }),
    ]);

    return {
      data: items,
      total,
      page: pageNumber,
      limit: limitNumber,
    };
  }

  async findOne(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID noto‘g‘ri kiritilgan');
    }

    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID noto‘g‘ri kiritilgan');
    }

    if (dto.name) {
      const alreadyExists = await this.prisma.category.findFirst({
        where: {
          name: dto.name,
          NOT: { id },
        },
      });

      if (alreadyExists) {
        throw new ConflictException(
          'Bunday nomli kategoriya allaqachon mavjud',
        );
      }
    }

    const exists = await this.prisma.category.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    if (!id || id <= 0) {
      throw new BadRequestException('ID noto‘g‘ri kiritilgan');
    }

    const exists = await this.prisma.category.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    await this.prisma.category.delete({ where: { id } });

    return { message: 'Kategoriya o‘chirildi' };
  }
}
