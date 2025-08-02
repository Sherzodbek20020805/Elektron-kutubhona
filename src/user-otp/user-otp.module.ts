import { Module } from '@nestjs/common';
import { UserOtpService } from './user-otp.service';
import { UserOtpController } from './user-otp.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserOtpController],
  providers: [UserOtpService],
})
export class UserOtpModule {}
