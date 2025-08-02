import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookImageDto } from './dto/create-book-image.dto';
import { UpdateBookImageDto } from './dto/update-book-image.dto';

@Injectable()
export class BookImageService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookImageDto) {
    const exists = await this.prisma.bookImage.findFirst({
      where: {
        url: dto.url,
        bookId: dto.bookId,
      },
    });
    if (exists) throw new ConflictException('Bunday rasm allaqachon mavjud');

    return this.prisma.bookImage.create({ data: dto });
  }

  async findAll() {
    const images = await this.prisma.bookImage.findMany({
      include: { book: true },
      orderBy: { createdAt: 'desc' },
    });

    if (images.length === 0) {
      throw new NotFoundException('Rasmlar topilmadi');
    }

    return images;
  }

  async findOne(id: number) {
    const image = await this.prisma.bookImage.findUnique({
      where: { id },
      include: { book: true },
    });

    if (!image) throw new NotFoundException('Rasm topilmadi');
    return image;
  }

  async update(id: number, dto: UpdateBookImageDto) {
    const exists = await this.prisma.bookImage.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Rasm topilmadi');

    return this.prisma.bookImage.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const exists = await this.prisma.bookImage.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Rasm topilmadi');

    await this.prisma.bookImage.delete({ where: { id } });
    return { message: 'Rasm o‘chirildi' };
  }
}
