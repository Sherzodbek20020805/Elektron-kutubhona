import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserOtpDto } from './dto/create-user-otp.dto';
import { UpdateUserOtpDto } from './dto/update-user-otp.dto';
import { Prisma, OtpStatus } from '@prisma/client';

@Injectable()
export class UserOtpService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserOtpDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });
      if (!user) {
        throw new BadRequestException('Foydalanuvchi topilmadi');
      }

      return await this.prisma.userOtp.create({ data: dto });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Bunday OTP kodi allaqachon mavjud');
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'OTP yaratishda xatolik yuz berdi',
      );
    }
  }
  async findAll() {
    try {
      const otps = await this.prisma.userOtp.findMany();

      if (!otps || otps.length === 0) {
        throw new NotFoundException('Hech qanday OTP topilmadi');
      }

      return otps;
    } catch (error) {
      throw new InternalServerErrorException(
        'OTPlarni olishda xatolik yuz berdi',
      );
    }
  }

  async findOne(id: number) {
    try {
      const otp = await this.prisma.userOtp.findUnique({ where: { id } });

      if (!otp) {
        throw new NotFoundException('OTP topilmadi');
      }
      if (otp.status === OtpStatus.VERIFIED) {
        throw new BadRequestException('Bu OTP allaqachon ishlatilgan');
      }
      return otp;
    } catch (error) {
      throw new InternalServerErrorException('OTPni olishda xatolik yuz berdi');
    }
  }

  async update(id: number, dto: UpdateUserOtpDto) {
  try {
  
    const exists = await this.prisma.userOtp.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('OTP topilmadi');
    }

    if (dto.code && dto.code.length !== 6) {
      throw new BadRequestException('OTP kodi 6 ta belgidan iborat bo‘lishi kerak');
    }

    return await this.prisma.userOtp.update({
      where: { id },
      data: dto,
    });

  } catch (error) {
    throw new InternalServerErrorException('OTP yangilashda xatolik yuz berdi');
  }
}
  async remove(id: number) {
  try {
    
    const otp = await this.prisma.userOtp.findUnique({ where: { id } });
    if (!otp) {
      throw new NotFoundException('OTP topilmadi');
    }

    await this.prisma.userOtp.delete({ where: { id } });

    return { message: 'OTP muvaffaqiyatli o‘chirildi' };
    
  } catch (error) {
    throw new InternalServerErrorException('OTPni o‘chirishda xatolik yuz berdi');
  }
}
}
