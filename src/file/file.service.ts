import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileType } from '@prisma/client'; 

@Injectable()
export class FileService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFileDto) {
    return this.prisma.file.create({ data: dto });
  }

async findAll(query: { search?: string; type?: FileType }) {
  const { search, type } = query;

  return this.prisma.file.findMany({
    where: {
      AND: [
        search
          ? {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {},
        type ? { type } : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
  });
}

  async findOne(id: number) {
    const file = await this.prisma.file.findUnique({ where: { id } });
    if (!file) throw new NotFoundException('Fayl topilmadi');
    return file;
  }

  async update(id: number, dto: UpdateFileDto) {
    const exists = await this.prisma.file.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Fayl topilmadi');
    return this.prisma.file.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    const exists = await this.prisma.file.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Fayl topilmadi');
    await this.prisma.file.delete({ where: { id } });
    return { message: 'Fayl o‘chirildi' };
  }
}
