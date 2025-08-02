import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';

import { AuthModule } from './auth/auth.module';

import { UserModule } from './user/user.module';
import { UserOtpModule } from './user-otp/user-otp.module';
import { AuthorModule } from './author/author.module';
import { CategoryModule } from './category/category.module';
import { BookModule } from './book/book.module';
import { BookImageModule } from './book-image/book-image.module';
import { BorrowingModule } from './borrowing/borrowing.module';

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
    
  ],
})
export class AppModule {}
