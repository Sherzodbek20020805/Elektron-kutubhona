import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateReviewDto) {
  const exists = await this.prisma.review.findFirst({
    where: {
      userId: dto.userId,
      bookId: dto.bookId,
    },
  });

  if (exists) {
    throw new ConflictException('Bu foydalanuvchi bu kitobga sharh bergan');
  }

  return this.prisma.review.create({
    data: {
      ...dto,
      comment: dto.comment ?? '', 
    },
  });
}
  async findAll(query: { bookId?: string; userId?: string }) {
    return this.prisma.review.findMany({
      where: {
        ...(query.bookId && { bookId: parseInt(query.bookId) }),
        ...(query.userId && { userId: parseInt(query.userId) }),
      },
      include: { user: true, book: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Sharh topilmadi');
    return review;
  }

  async update(id: number, dto: UpdateReviewDto) {
    const exists = await this.prisma.review.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Sharh topilmadi');

    return this.prisma.review.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const exists = await this.prisma.review.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Sharh topilmadi');

    await this.prisma.review.delete({ where: { id } });
    return { message: 'Sharh o‘chirildi' };
  }
}
