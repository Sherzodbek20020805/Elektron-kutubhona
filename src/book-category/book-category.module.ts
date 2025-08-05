import { Module } from '@nestjs/common';
import { BookCategoryService } from './book-category.service';
import { BookCategoryController } from './book-category.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from  'src/common';

@Module({
  imports: [PrismaModule, CommonModule],
  controllers: [BookCategoryController],
  providers: [BookCategoryService, PrismaService],
})
export class BookCategoryModule {}
