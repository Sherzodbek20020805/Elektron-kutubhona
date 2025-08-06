import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
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
    try {
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

      return await this.prisma.bookCategory.create({ data: dto });
    } catch (error) {
      throw new InternalServerErrorException(
        this.common.translate('bookCategory.create_error', lang),
      );
    }
  }

  async findAll() {
    try {
      return await this.prisma.bookCategory.findMany({
        include: {
          book: true,
          category: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Kitob-kategoriya ro‘yxatini olishda xatolik');
    }
  }

  async findOne(id: number, lang = 'uz') {
    try {
      const bookCategory = await this.prisma.bookCategory.findUnique({ where: { id } });

      if (!bookCategory) {
        throw new NotFoundException(this.common.translate('bookCategory.not_found', lang));
      }

      return bookCategory;
    } catch (error) {
      throw new InternalServerErrorException(
        this.common.translate('bookCategory.find_error', lang),
      );
    }
  }

  async update(id: number, dto: UpdateBookCategoryDto, lang = 'uz') {
    try {
      const exists = await this.prisma.bookCategory.findUnique({ where: { id } });

      if (!exists) {
        throw new NotFoundException(this.common.translate('bookCategory.not_found', lang));
      }

      return await this.prisma.bookCategory.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        this.common.translate('bookCategory.update_error', lang),
      );
    }
  }

  async remove(id: number, lang = 'uz') {
    try {
      const exists = await this.prisma.bookCategory.findUnique({ where: { id } });

      if (!exists) {
        throw new NotFoundException(this.common.translate('bookCategory.not_found', lang));
      }

      await this.prisma.bookCategory.delete({ where: { id } });

      return { message: this.common.translate('bookCategory.deleted', lang) };
    } catch (error) {
      throw new InternalServerErrorException(
        this.common.translate('bookCategory.delete_error', lang),
      );
    }
  }
}
