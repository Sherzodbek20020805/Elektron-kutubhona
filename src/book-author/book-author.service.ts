import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';

@Injectable()
export class BookAuthorService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateBookAuthorDto) {
    return this.prisma.bookAuthor.create({ data: dto });
  }

  findAll() {
    return this.prisma.bookAuthor.findMany({
      include: {
        book: true,
        author: true,
      },
    });
  }

  async findOne(id: number) {
    const bookAuthor = await this.prisma.bookAuthor.findUnique({ where: { id } });
    if (!bookAuthor) throw new NotFoundException('Ushbu kitob-muallif topilmadi');
    return bookAuthor;
  }

  async update(id: number, dto: UpdateBookAuthorDto) {
    await this.findOne(id);
    return this.prisma.bookAuthor.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.bookAuthor.delete({ where: { id } });
  }
}
