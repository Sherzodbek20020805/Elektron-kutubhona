import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  translate(messageKey: string, lang: string = 'uz'): string {
    const messages = {
      'bookCategory.exists': {
        uz: 'Ushbu bogʻlanma allaqachon mavjud',
        en: 'This book-category relation already exists',
        ru: 'Эта связь книга-категория уже существует',
      },
      'bookCategory.not_found': {
        uz: 'Bogʻlanma topilmadi',
        en: 'Book-category relation not found',
        ru: 'Связь книга-категория не найдена',
      },
      'bookCategory.deleted': {
        uz: 'Bogʻlanma o‘chirildi',
        en: 'Relation deleted',
        ru: 'Связь удалена',
      },
    };

    return messages[messageKey]?.[lang] ?? messageKey;
  }
}
