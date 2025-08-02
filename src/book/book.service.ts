import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    const exists = await this.prisma.book.findFirst({
      where: { title: dto.title },
    });
    if (exists) throw new ConflictException('Bunday kitob allaqachon mavjud');
    if (!dto.title?.trim()) {
      throw new BadRequestException('Kitob nomi majburiy');
    }
    if (!dto.authorId) {
      throw new BadRequestException('Muallif ID majburiy');
    }
    if (!dto.categoryId) {
      throw new BadRequestException('Kategoriya ID majburiy');
    }

    return this.prisma.book.create({
      data: { ...dto, description: dto.description ?? '' },
    });
  }

  async findAll(query: { search?: string; page?: string; limit?: string }) {
    const { search, page = '1', limit = '10' } = query;
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;
    if (isNaN(pageNumber) || pageNumber < 1) {
      throw new BadRequestException('page noto‘g‘ri');
    }
    if (isNaN(limitNumber) || limitNumber < 1) {
      throw new BadRequestException('limit noto‘g‘ri');
    }
    const result = await this.prisma.book.findMany({
      where: search
        ? { title: { contains: search, mode: 'insensitive' } }
        : undefined,
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        category: true,
      },
    });
    if (result.length === 0) {
      throw new NotFoundException('Kitoblar topilmadi');
    }
    return result;
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { author: true, category: true },
    });

    if (!book) throw new NotFoundException('Kitob topilmadi');

    return book;
  }

  async update(id: number, dto: UpdateBookDto) {
    const exists = await this.prisma.book.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Kitob topilmadi');
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID noto‘g‘ri');
    }

    if (dto.authorId) {
      const author = await this.prisma.author.findUnique({
        where: { id: dto.authorId },
      });
      if (!author) throw new NotFoundException('Bunday muallif mavjud emas');
    }

    return this.prisma.book.update({ where: { id }, data: dto });
  }

 async remove(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new BadRequestException('ID noto‘g‘ri');
  }

  const exists = await this.prisma.book.findUnique({ where: { id } });
  if (!exists) {
    throw new NotFoundException('Kitob topilmadi');
  }

  await this.prisma.book.delete({ where: { id } });
  return { message: 'Kitob muvaffaqiyatli o‘chirildi' };
}}