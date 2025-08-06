import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  async sendOtp(to: string, code: string) {
    try {
      const info = await this.transporter.sendMail({
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
