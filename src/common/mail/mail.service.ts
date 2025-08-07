import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(user: User) {
    const url = `${process.env.API_URL}/api/user/activate/${user.activation_link}`;

    await this.mailerService.sendMail({
      from: process.env.smtp_user,
      to: user.email,
      subject: 'Emailni tasdiqlang',
      text: `Assalomu alaykum ${user.fullName}, emailni tasdiqlash uchun quyidagi linkdan foydalaning: https://yourfrontend.com/verify/${user.activation_link}`,
    });
  }

  async sendResetPasswordEmail(user: User, resetPasswordUrl: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Parolni tiklash',
      template: 'reset-password',
      context: {
        username: user.fullName,
        resetPasswordUrl,
      },
    });
  }


  async sendOtp(to: string, code: string) {
    try {
      const info = await this.mailerService.sendMail({
        from: `"Elektron Kutubxona" <${process.env.MAIL_USER}>`,
        to,
        subject: 'Tasdiqlash kodi (OTP)',
        html: `
          <div style="font-family:sans-serif">
            <h3>Salom!</h3>
            <p>Sizning tasdiqlash kodingiz:</p>
            <h2 style="color:#3f51b5">${code}</h2>
            <p>Bu kod <b>faqat bir marta</b> ishlatiladi.</p>
          </div>
        `,
      });

      console.log('Email yuborildi:', info.messageId);
    } catch (error) {
      console.error('Email yuborishda xatolik:', error);
      throw new InternalServerErrorException('Email yuborib bo‘lmadi');
    }
  }
}
