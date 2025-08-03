import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import {
  AuthModule,
  UserModule,
  UserOtpModule,
  AuthorModule,
  CategoryModule,
  BookModule,
  BookImageModule,
  BorrowingModule,
  ReviewModule,
  FileModule
} from './index';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UserModule,
    UserOtpModule,
    AuthorModule,
    CategoryModule,
    BookModule,
    BookImageModule,
    BorrowingModule,
    ReviewModule,
    FileModule,
  ],
})
export class AppModule {}
