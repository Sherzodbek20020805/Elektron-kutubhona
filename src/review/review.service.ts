import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReviewDto) {
    try {
      const exists = await this.prisma.review.findFirst({
        where: {
          userId: dto.userId,
          bookId: dto.bookId,
        },
      });

      if (exists) {
        throw new ConflictException('Bu foydalanuvchi bu kitobga sharh bergan');
      }

      return await this.prisma.review.create({
        data: {
          ...dto,
          comment: dto.comment ?? '',
        },
      });
    } catch (error) {
      console.error('Sharh yaratishda xatolik:', error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Sharh yaratishda xatolik yuz berdi');
    }
  }

  async findAll(query: { bookId?: string; userId?: string }) {
    try {
      return await this.prisma.review.findMany({
        where: {
          ...(query.bookId && { bookId: parseInt(query.bookId) }),
          ...(query.userId && { userId: parseInt(query.userId) }),
        },
        include: { user: true, book: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      console.error('Sharhlarni olishda xatolik:', error);
      throw new InternalServerErrorException('Sharhlarni olishda xatolik yuz berdi');
    }
  }

  async findOne(id: number) {
    try {
      const review = await this.prisma.review.findUnique({ where: { id } });
      if (!review) throw new NotFoundException('Sharh topilmadi');
      return review;
    } catch (error) {
      console.error('Sharhni olishda xatolik:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Sharhni olishda xatolik yuz berdi');
    }
  }

  async update(id: number, dto: UpdateReviewDto) {
    try {
      const exists = await this.prisma.review.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Sharh topilmadi');

      return await this.prisma.review.update({ where: { id }, data: dto });
    } catch (error) {
      console.error('Sharhni yangilashda xatolik:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Sharhni yangilashda xatolik yuz berdi');
    }
  }

  async remove(id: number) {
    try {
      const exists = await this.prisma.review.findUnique({ where: { id } });
      if (!exists) throw new NotFoundException('Sharh topilmadi');

      await this.prisma.review.delete({ where: { id } });
      return { message: 'Sharh o‘chirildi' };
    } catch (error) {
      console.error('Sharhni o‘chirishda xatolik:', error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Sharhni o‘chirishda xatolik yuz berdi');
    }
  }
}
