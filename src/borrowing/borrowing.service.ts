import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { UpdateBorrowingDto } from './dto/update-borrowing.dto';
import { log } from 'console';
import { BorrowingStatus } from '@prisma/client';

@Injectable()
export class BorrowingService {
  constructor(private readonly prisma: PrismaService) {}

 async create(dto: CreateBorrowingDto) {
  try {
    // Yangi validatsiya: user va book mavjudligini tekshirish
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    const book = await this.prisma.book.findUnique({ where: { id: dto.bookId } });
    if (!book) {
      throw new NotFoundException('Kitob topilmadi');
    }

    const exists = await this.prisma.borrowing.findFirst({
      where: {
        userId: dto.userId,
        bookId: dto.bookId,
        status: BorrowingStatus.BORROWED,
      },
    });

    if (exists) {
      throw new ConflictException(
        'Bu foydalanuvchi ushbu kitobni hali qaytarmagan',
      );
    }

    return await this.prisma.borrowing.create({
     data: {
    userId: dto.userId,
    bookId: dto.bookId,
    fromDate: new Date(dto.fromDate),
    toDate: new Date(dto.toDate),
    status: dto.status ?? BorrowingStatus.BORROWED,
    returned: dto.returned ? new Date(dto.returned) : (
      dto.status === BorrowingStatus.RETURNED ? new Date() : undefined
    ),
  },
    });
  } catch (error) {
    if (error instanceof HttpException) throw error;
    console.error('Ijara yaratish xatosi:', error);
    throw new InternalServerErrorException(
      'Ijarani yaratishda xatolik yuz berdi',
    );
  }
}

  async findAll() {
    try {
      const result = await this.prisma.borrowing.findMany({
        include: {
          user: true,
          book: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!result.length) {
        throw new NotFoundException('Ijaralar topilmadi');
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ijaralar ro‘yxatini olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: number) {
    try {
      const result = await this.prisma.borrowing.findUnique({
        where: { id },
        include: {
          user: true,
          book: true,
        },
      });

      if (!result) {
        throw new NotFoundException('Ijara topilmadi');
      }

      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ijarani olishda xatolik yuz berdi',
      );
    }
  }

  async update(id: number, dto: UpdateBorrowingDto) {
    try {
      const exists = await this.prisma.borrowing.findUnique({ where: { id } });

      if (!exists) {
        throw new NotFoundException('Ijara topilmadi');
      }

      return await this.prisma.borrowing.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Ijarani yangilashda xatolik yuz berdi',
      );
    }
  }

  async remove(id: number) {
    try {
      const exists = await this.prisma.borrowing.findUnique({ where: { id } });

      if (!exists) {
        throw new NotFoundException('Ijara topilmadi');
      }

      await this.prisma.borrowing.delete({ where: { id } });
      return { message: 'Ijara muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      throw new InternalServerErrorException(
        'Ijarani o‘chirishda xatolik yuz berdi',
      );
    }
  }
}
