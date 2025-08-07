  import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { PrismaService } from 'src/prisma/prisma.service';
  import { CreateBookDto } from './dto/create-book.dto';
  import { UpdateBookDto } from './dto/update-book.dto';
  import { Prisma } from '@prisma/client';

  @Injectable()
  export class BookService {
    constructor(private readonly prisma: PrismaService) {}
async create(dto: CreateBookDto) {
  try {
    const exists = await this.prisma.book.findFirst({
      where: { title: dto.title },
    });
    if (exists) {
      throw new ConflictException('Bunday kitob allaqachon mavjud');
    }

    if (!dto.title?.trim()) {
      throw new BadRequestException('Kitob nomi majburiy');
    }
    if (!dto.authorId) {
      throw new BadRequestException('Muallif ID majburiy');
    }
    if (!dto.categoryId) {
      throw new BadRequestException('Kategoriya ID majburiy');
    }

    const book = await this.prisma.book.create({
      data: {
        title: dto.title,
        description: dto.description ?? '',
       
        bookAuthors: {
          create: [
            {
              author: {
                connect: { id: dto.authorId },
              },
            },
          ],
        },
        bookCategories: {
          create: [
            {
              category: {
                connect: { id: dto.categoryId },
              },
            },
          ],
        },
      },
      include: {
        bookAuthors: true,
        bookCategories: true,
      },
    });

    return {
      message: 'Kitob muvaffaqiyatli yaratildi',
      data: book,
    };
  } catch (error) {
    if (error instanceof ConflictException || error instanceof BadRequestException) {
      throw error;
    }
    console.error('Kitob yaratishda xatolik:', error);
    throw new InternalServerErrorException(
      error?.message || 'Kitobni yaratishda xatolik yuz berdi',
    );
  }
}


    async findAll(query: { search?: string; page?: string; limit?: string }) {
      try {
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

        const whereClause: Prisma.BookWhereInput = search
          ? {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {};

        const result = await this.prisma.book.findMany({
          where: whereClause,
          skip,
          take: limitNumber,
          orderBy: { createdAt: 'desc' },
          include: {
            bookAuthors: { include: { author: true } },
            bookCategories: { include: { category: true } },
          },
        });

        if (result.length === 0) {
          throw new NotFoundException('Kitoblar topilmadi');
        }

        return result;
      } catch (error) {
        throw new InternalServerErrorException(error?.message || 'Xatolik yuz berdi');
      }
    }

    async findOne(id: number) {
      try {
        const book = await this.prisma.book.findUnique({
          where: { id },
          include: {
            bookAuthors: { include: { author: true } },
            bookCategories: { include: { category: true } },
            reviews: { include: { user: true } },
            images: true,
            file: true,
          },
        });

        if (!book) throw new NotFoundException('Kitob topilmadi');
        return book;
      } catch (error) {
        throw new InternalServerErrorException(error?.message || 'Xatolik yuz berdi');
      }
    }

    async update(id: number, dto: UpdateBookDto) {
      try {
        if (!Number.isInteger(id) || id <= 0) {
          throw new BadRequestException('ID noto‘g‘ri');
        }

        const exists = await this.prisma.book.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('Kitob topilmadi');

        if (dto.authorId) {
          const author = await this.prisma.author.findUnique({
            where: { id: dto.authorId },
          });
          if (!author) throw new NotFoundException('Bunday muallif mavjud emas');
        }

        return await this.prisma.book.update({ where: { id }, data: dto });
      } catch (error) {
        throw new InternalServerErrorException(error?.message || 'Xatolik yuz berdi');
      }
    }

    async remove(id: number) {
      try {
        if (!Number.isInteger(id) || id <= 0) {
          throw new BadRequestException('ID noto‘g‘ri');
        }

        const exists = await this.prisma.book.findUnique({ where: { id } });
        if (!exists) {
          throw new NotFoundException('Kitob topilmadi');
        }

        await this.prisma.book.delete({ where: { id } });
        return { message: 'Kitob muvaffaqiyatli o‘chirildi' };
      } catch (error) {
        throw new InternalServerErrorException(error?.message || 'Xatolik yuz berdi');
      }
    }
  }
