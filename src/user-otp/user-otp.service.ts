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
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MailService } from 'src/common';

@Injectable()
export class UserOtpService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateUserOtpDto) {
    try {
      
      const user = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });

      if (!user) {
        throw new BadRequestException('Foydalanuvchi topilmadi');
      }

      const createdOtp = await this.prisma.userOtp.create({
        data: {
          code: dto.code,
          userId: dto.userId,
          status: dto.status,
          expiresAt: new Date(dto.expiresAt),
        },
      });

      await this.mailService.sendOtp(user.email, dto.code);

      return {
        message: 'OTP muvaffaqiyatli yaratildi va emailga yuborildi',
        data: createdOtp,
      };
    } catch (error) {
      console.error('OTP yaratishda xatolik:', error);

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Bunday OTP kodi allaqachon mavjud');
        }
        throw new BadRequestException(`Prisma xatosi: ${error.message}`);
      }

      throw new InternalServerErrorException(
        'OTP yaratishda ichki xatolik yuz berdi',
      );
    }
  }

  


  async findAll() {
    try {
      const otps = await this.prisma.userOtp.findMany();

      if (!otps.length) {
        throw new NotFoundException('Hech qanday OTP topilmadi');
      }

      return otps;
    } catch (error) {
      console.error('OTPlarni olishda xatolik:', error);
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
      console.error('OTPni olishda xatolik:', error);
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
      console.error('OTPni yangilashda xatolik:', error);
      throw new InternalServerErrorException('OTPni yangilashda xatolik yuz berdi');
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
      console.error('OTPni o‘chirishda xatolik:', error);
      throw new InternalServerErrorException('OTPni o‘chirishda xatolik yuz berdi');
    }
  }
}
