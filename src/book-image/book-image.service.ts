import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookImageDto } from './dto/create-book-image.dto';
import { UpdateBookImageDto } from './dto/update-book-image.dto';

@Injectable()
export class BookImageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookImageDto) {
    try {
      const exists = await this.prisma.bookImage.findFirst({
        where: {
          url: dto.url,
          bookId: dto.bookId,
        },
      });

      if (exists) {
        throw new ConflictException('Bunday rasm allaqachon mavjud');
      }

      return await this.prisma.bookImage.create({ data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Rasm yaratishda xatolik yuz berdi');
    }
  }

  async findAll() {
    try {
      const images = await this.prisma.bookImage.findMany({
        include: { book: true },
        orderBy: { createdAt: 'desc' },
      });

      if (images.length === 0) {
        throw new NotFoundException('Rasmlar topilmadi');
      }

      return images;
    } catch (error) {
      throw new InternalServerErrorException('Rasmlar ro‘yxatini olishda xatolik yuz berdi');
    }
  }

  async findOne(id: number) {
    try {
      const image = await this.prisma.bookImage.findUnique({
        where: { id },
        include: { book: true },
      });

      if (!image) {
        throw new NotFoundException('Rasm topilmadi');
      }

      return image;
    } catch (error) {
      throw new InternalServerErrorException('Rasmni olishda xatolik yuz berdi');
    }
  }

  async update(id: number, dto: UpdateBookImageDto) {
    try {
      const exists = await this.prisma.bookImage.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Rasm topilmadi');
      }

      return await this.prisma.bookImage.update({ where: { id }, data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Rasmni yangilashda xatolik yuz berdi');
    }
  }

  async remove(id: number) {
    try {
      const exists = await this.prisma.bookImage.findUnique({ where: { id } });
      if (!exists) {
        throw new NotFoundException('Rasm topilmadi');
      }

      await this.prisma.bookImage.delete({ where: { id } });
      return { message: 'Rasm o‘chirildi' };
    } catch (error) {
      throw new InternalServerErrorException('Rasmni o‘chirishda xatolik yuz berdi');
    }
  }
}
