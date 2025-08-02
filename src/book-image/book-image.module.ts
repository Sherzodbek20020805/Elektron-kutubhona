import { Module } from '@nestjs/common';
import { BookImageService } from './book-image.service';
import { BookImageController } from './book-image.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BookImageService],
  controllers: [BookImageController],
})
export class BookImageModule {}
