import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAuthorDto) {
    try {
      const exists = await this.prisma.author.findFirst({
        where: { fullName: dto.fullName },
      });

      if (exists) {
        throw new ConflictException('Muallif allaqachon mavjud');
      }

      return await this.prisma.author.create({ data: dto });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ushbu muallif allaqachon mavjud');
      }
      console.error('Author create error:', error);
      throw new Error('Ichki server xatosi');
    }
  }

  async findAll(query: { search?: string; page?: string; limit?: string }) {
    const { search = '', page = '1', limit = '10' } = query;

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    const skip = (pageNumber - 1) * limitNumber;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.author.findMany({
        where: {
          fullName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip,
        take: limitNumber,
        orderBy: { id: 'desc' },
      }),
      this.prisma.author.count({
        where: {
          fullName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return {
      data,
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    };
  }

  //author?search=ali&page=2&limit=5


  async findOne(id: number) {
    const author = await this.prisma.author.findUnique({ where: { id } });
    if (!author) throw new NotFoundException('Muallif topilmadi');
    return author;

    if (isNaN(id)) {
      throw new BadRequestException('ID noto‘g‘ri formatda');
    }
  }

  async update(id: number, dto: UpdateAuthorDto) {
    const exists = await this.prisma.author.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Muallif topilmadi');

    if (isNaN(id)) {
      throw new BadRequestException('ID noto‘g‘ri formatda');
    }

    if (dto.fullName) {
      const duplicate = await this.prisma.author.findFirst({
        where: {
          fullName: dto.fullName,
          NOT: { id },
        },
      });

      if (duplicate) {
        throw new ConflictException('Bunday muallif allaqachon mavjud');
      }
    }

    return this.prisma.author.update({ where: { id }, data: dto });
  }

async remove(id: number, currentUser: { role: string }) {
  const exists = await this.prisma.author.findUnique({ where: { id } });
  if (!exists) throw new NotFoundException('Muallif topilmadi');

  if (isNaN(id)) {
    throw new BadRequestException('ID noto‘g‘ri formatda');
  }
  if (currentUser.role !== 'ADMIN') {
    throw new ForbiddenException('Sizda bu amalni bajarishga ruxsat yo‘q');
  }

  await this.prisma.author.delete({ where: { id } });

  return { message: 'Muallif o‘chirildi' };
}
}
