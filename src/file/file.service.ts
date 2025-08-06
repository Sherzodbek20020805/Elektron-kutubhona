import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileType } from '@prisma/client';

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFileDto) {
    try {
      return await this.prisma.file.create({ data: dto });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Fayl yaratishda xatolik yuz berdi');
    }
  }

  async findAll(query: { search?: string; type?: FileType }) {
    try {
      const { search, type } = query;

      const result = await this.prisma.file.findMany({
        where: {
          AND: [
            search
              ? {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                }
              : {},
            type ? { type } : {},
          ],
        },
        orderBy: { createdAt: 'desc' },
      });

      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Fayllarni olishda xatolik yuz berdi');
    }
  }

  async findOne(id: number) {
    try {
      if (!id || id <= 0) throw new BadRequestException('ID noto‘g‘ri kiritilgan');

      const file = await this.prisma.file.findUnique({ where: { id } });
      if (!file) throw new NotFoundException('Fayl topilmadi');

      return file;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Faylni olishda xatolik yuz berdi');
    }
  }

  async update(id: number, dto: UpdateFileDto) {
    try {
      if (!id || id <= 0) throw new BadRequestException('ID noto‘g‘ri kiritilgan');

      const exists = await this.prisma.file.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Fayl topilmadi');

      return await this.prisma.file.update({ where: { id }, data: dto });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Faylni yangilashda xatolik yuz berdi');
    }
  }

  async remove(id: number) {
    try {
      if (!id || id <= 0) throw new BadRequestException('ID noto‘g‘ri kiritilgan');

      const exists = await this.prisma.file.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Fayl topilmadi');

      await this.prisma.file.delete({ where: { id } });

      return { message: 'Fayl o‘chirildi' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Faylni o‘chirishda xatolik yuz berdi');
    }
  }
}
