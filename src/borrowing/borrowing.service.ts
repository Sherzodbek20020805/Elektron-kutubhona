import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBorrowingDto } from './dto/create-borrowing.dto';
import { UpdateBorrowingDto } from './dto/update-borrowing.dto';

@Injectable()
export class BorrowingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBorrowingDto) {
  const exists = await this.prisma.borrowing.findFirst({
    where: {
      userId: dto.userId,
      bookId: dto.bookId,
      // status: 'BORROWED',
    },
  });

  if (exists) {
    throw new ConflictException('Bu foydalanuvchi ushbu kitobni hali qaytarmagan');
  }

  return this.prisma.borrowing.create({
    data: {
      ...dto,
      // status: dto.status ?? 'BORROWED', 
    },
  });
}

  async findAll() {
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
  }

  async findOne(id: number) {
    const result = await this.prisma.borrowing.findUnique({
      where: { id },
      include: {
        user: true,
        book: true,
      },
    });

    if (!result) throw new NotFoundException('Ijarasi topilmadi');
    return result;
  }

  async update(id: number, dto: UpdateBorrowingDto) {
    const exists = await this.prisma.borrowing.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Ijarasi topilmadi');

    return this.prisma.borrowing.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const exists = await this.prisma.borrowing.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Ijarasi topilmadi');

    await this.prisma.borrowing.delete({ where: { id } });
    return { message: 'Ijarasi o‘chirildi' };
  }
}
