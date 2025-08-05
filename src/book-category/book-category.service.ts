import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookCategoryDto } from './dto/create-book-category.dto';
import { UpdateBookCategoryDto } from './dto/update-book-category.dto';
import { CommonService } from 'src/common';

@Injectable()
export class BookCategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly common: CommonService,
  ) {}

  async create(dto: CreateBookCategoryDto, lang = 'uz') {
    const exists = await this.prisma.bookCategory.findUnique({
      where: {
        bookId_categoryId: {
          bookId: dto.bookId,
          categoryId: dto.categoryId,
        },
      },
    });

    if (exists) {
      throw new ConflictException(this.common.translate('bookCategory.exists', lang));
    }

    return this.prisma.bookCategory.create({ data: dto });
  }

  async findAll() {
    return this.prisma.bookCategory.findMany({
      include: {
        book: true,
        category: true,
      },
    });
  }

  async findOne(id: number, lang = 'uz') {
    const bookCategory = await this.prisma.bookCategory.findUnique({ where: { id } });

    if (!bookCategory) {
      throw new NotFoundException(this.common.translate('bookCategory.not_found', lang));
    }

    return bookCategory;
  }

  async update(id: number, dto: UpdateBookCategoryDto, lang = 'uz') {
    const exists = await this.prisma.bookCategory.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException(this.common.translate('bookCategory.not_found', lang));
    }

    return this.prisma.bookCategory.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, lang = 'uz') {
    const exists = await this.prisma.bookCategory.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException(this.common.translate('bookCategory.not_found', lang));
    }

    await this.prisma.bookCategory.delete({ where: { id } });
    return { message: this.common.translate('bookCategory.deleted', lang) };
  }
}
