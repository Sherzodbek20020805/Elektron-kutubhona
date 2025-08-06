import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { Tokens } from '../common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const userExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (userExists) {
        throw new ConflictException('Bunday foydalanuvchi allaqachon mavjud');
      }

      const hashed = await bcrypt.hash(dto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashed,
          fullName: dto.full_name,
        },
      });

      return {
        message: 'Ro‘yxatdan muvaffaqiyatli o‘tildi',
        userId: user.id,
      };
    } catch (error) {
      throw new InternalServerErrorException(error?.message || 'Ro‘yxatdan o‘tishda xatolik');
    }
  }

  async login(dto: LoginDto, res: Response) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });

      if (!user || !(await bcrypt.compare(dto.password, user.password))) {
        throw new UnauthorizedException('Email yoki parol noto‘g‘ri');
      }

      const tokens = await this.generateTokens(user.id, user.email, user.role);
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 kun
      });

      return {
        message: 'Tizimga kirildi',
        userId: user.id,
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      throw new InternalServerErrorException(error?.message || 'Kirishda xatolik');
    }
  }

  async refreshTokens(userId: number, refreshToken: string, res: Response) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');

      const tokens = await this.generateTokens(user.id, user.email, user.role);

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        message: 'Token yangilandi',
        userId: user.id,
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      throw new InternalServerErrorException(error?.message || 'Tokenni yangilashda xatolik');
    }
  }

  async logout(res: Response) {
    try {
      res.clearCookie('refreshToken');
      return { message: 'Chiqildi' };
    } catch (error) {
      throw new InternalServerErrorException(error?.message || 'Chiqishda xatolik');
    }
  }

  private async generateTokens(
    userId: number,
    email: string,
    role: string,
  ): Promise<Tokens> {
    try {
      const payload = { id: userId, email, role };
      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: process.env.ACCESS_TOKEN_KEY,
          expiresIn: process.env.ACCESS_TOKEN_TIME,
        }),
        this.jwtService.signAsync(payload, {
          secret: process.env.REFRESH_TOKEN_KEY,
          expiresIn: process.env.REFRESH_TOKEN_TIME,
        }),
      ]);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException('Token generatsiyasida xatolik');
    }
  }
}
