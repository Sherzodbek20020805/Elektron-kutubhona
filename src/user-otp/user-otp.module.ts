import { Module } from '@nestjs/common';
import { UserOtpService } from './user-otp.service';
import { UserOtpController } from './user-otp.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailModule } from 'src/common';

@Module({
  imports: [PrismaModule , MailModule],
  controllers: [UserOtpController],
  providers: [UserOtpService],
})
export class UserOtpModule {}
