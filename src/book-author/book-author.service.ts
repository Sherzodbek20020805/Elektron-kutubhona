import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';

@Injectable()
export class BookAuthorService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookAuthorDto) {
    try {
      return await this.prisma.bookAuthor.create({ data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Kitob-muallif yaratishda xatolik');
    }
  }

  async findAll() {
    try {
      return await this.prisma.bookAuthor.findMany({
        include: {
          book: true,
          author: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Kitob-mualliflar ro‘yxatini olishda xatolik');
    }
  }

  async findOne(id: number) {
    try {
      const bookAuthor = await this.prisma.bookAuthor.findUnique({ where: { id } });
      if (!bookAuthor) throw new NotFoundException('Ushbu kitob-muallif topilmadi');
      return bookAuthor;
    } catch (error) {
      throw new InternalServerErrorException('Kitob-muallifni olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateBookAuthorDto) {
    try {
      await this.findOne(id);
      return await this.prisma.bookAuthor.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException('Kitob-muallifni yangilashda xatolik');
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);
      await this.prisma.bookAuthor.delete({ where: { id } });
      return { message: 'Kitob-muallif muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      throw new InternalServerErrorException('Kitob-muallifni o‘chirishda xatolik');
    }
  }
}
