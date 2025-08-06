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
  try {
    // name bo‘sh bo‘lsa
    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('Kategoriya nomi bo‘sh bo‘lmasligi kerak');
    }

    const exists = await this.prisma.category.findFirst({
      where: { name: dto.name.trim() },
    });

    if (exists) {
      throw new ConflictException('Bunday kategoriya allaqachon mavjud');
    }

    return await this.prisma.category.create({
      data: {
        name: dto.name.trim(),
      },
    });

  } catch (error) {
    if (error.code === 'P2002') {
      throw new ConflictException('Ushbu nomdagi kategoriya mavjud');
    }

    if (error instanceof BadRequestException || error instanceof ConflictException) {
      throw error; 
    }
    console.error('Kategoriya yaratish xatosi:', error);
    throw new InternalServerErrorException('Kategoriya yaratishda ichki server xatoligi yuz berdi');
  }
}


  async findAll(query: { search?: string; page?: string; limit?: string }) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Kategoriyalarni olishda xatolik yuz berdi');
    }
  }

  async findOne(id: number) {
    try {
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
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Kategoriyani olishda xatolik yuz berdi');
    }
  }

  async update(id: number, dto: UpdateCategoryDto) {
    try {
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
          throw new ConflictException('Bunday nomli kategoriya allaqachon mavjud');
        }
      }

      const exists = await this.prisma.category.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Kategoriya topilmadi');
      }

      return await this.prisma.category.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Kategoriyani yangilashda xatolik yuz berdi');
    }
  }

  async remove(id: number) {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException('ID noto‘g‘ri kiritilgan');
      }

      const exists = await this.prisma.category.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Kategoriya topilmadi');
      }

      await this.prisma.category.delete({ where: { id } });

      return { message: 'Kategoriya o‘chirildi' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Kategoriyani o‘chirishda xatolik yuz berdi');
    }
  }
}
