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

    return this.prisma.book.create({ data: { ...dto, description: dto.description ?? '' } });
  }

  async findAll(query: { search?: string; page?: string; limit?: string }) {
    const { search, page = '1', limit = '10' } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    return this.prisma.book.findMany({
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

    return this.prisma.book.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const exists = await this.prisma.book.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Kitob topilmadi');

    await this.prisma.book.delete({ where: { id } });
    return { message: 'Kitob o‘chirildi' };
  }
}
