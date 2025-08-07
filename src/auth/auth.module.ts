import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { MailModule, RefreshTokenStrategy ,  /*AccessTokenStrategy*/} from '../common';


@Module({
  
  imports:[JwtModule.register({}), PrismaModule, UserModule, MailModule],
  controllers: [AuthController],
  providers: [RefreshTokenStrategy,AuthService,   /*AccessTokenStrategy*/],
  exports: [AuthService],
})
export class AuthModule {}
