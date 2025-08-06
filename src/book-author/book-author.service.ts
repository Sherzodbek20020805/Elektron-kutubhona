import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookAuthorDto } from './dto/create-book-author.dto';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto';

@Injectable()
export class BookAuthorService {
  constructor(private readonly prisma: PrismaService) {}
async create(dto: CreateBookAuthorDto) {
  try {
    const exists = await this.prisma.bookAuthor.findFirst({
      where: {
        bookId: dto.bookId,
        authorId: dto.authorId,
      },
    });

    if (exists) {
      throw new ConflictException(
        'Bu muallif va kitob bog‘lanishi allaqachon mavjud',
      );
    }

    if (!dto.bookId || !dto.authorId) {
      throw new BadRequestException('Kitob va muallif ID majburiy');
    }

    const book = await this.prisma.book.findUnique({
      where: { id: dto.bookId },
    });
    if (!book) {
      throw new BadRequestException(
        `Kitob ID ${dto.bookId} topilmadi`,
      );
    }

    const author = await this.prisma.author.findUnique({
      where: { id: dto.authorId },
    });
    if (!author) {
      throw new BadRequestException(
        `Muallif ID ${dto.authorId} topilmadi`,
      );
    }

    return await this.prisma.bookAuthor.create({ data: dto });
  } catch (error: any) {
    if (error instanceof BadRequestException || error instanceof ConflictException) {
      throw error;
    }
    console.error('Kitob-muallif yaratishda xatolik:', error); 
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
    } catch {
      throw new InternalServerErrorException(
        'Kitob-mualliflar ro‘yxatini olishda xatolik',
      );
    }
  }

  async findOne(id: number) {
    try {
      const bookAuthor = await this.prisma.bookAuthor.findUnique({
        where: { id },
      });
      if (!bookAuthor)
        throw new NotFoundException('Ushbu kitob-muallif topilmadi');
      return bookAuthor;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Kitob-muallifni olishda xatolik');
    }
  }

  async update(id: number, dto: UpdateBookAuthorDto) {
    try {
      await this.findOne(id);

      if (dto.bookId) {
        const book = await this.prisma.book.findUnique({
          where: { id: dto.bookId },
        });
        if (!book) {
          throw new BadRequestException(`Book with ID ${dto.bookId} not found`);
        }
      }

      if (dto.authorId) {
        const author = await this.prisma.author.findUnique({
          where: { id: dto.authorId },
        });
        if (!author) {
          throw new BadRequestException(
            `Author with ID ${dto.authorId} not found`,
          );
        }
      }

      return await this.prisma.bookAuthor.update({
        where: { id },
        data: dto,
      });
    } catch (error: any) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Kitob-muallifni yangilashda xatolik',
      );
    }
  }

  async remove(id: number) {
    try {
      await this.findOne(id);

      await this.prisma.bookAuthor.delete({ where: { id } });
      return { message: 'Kitob-muallif muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Kitob-muallifni o‘chirishda xatolik',
      );
    }
  }
}
