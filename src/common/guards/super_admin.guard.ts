import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const creatingRole: Role = request.body?.role;

    const userId = request.user?.id;
    if (!userId) {
      throw new ForbiddenException('Foydalanuvchi aniqlanmadi');
    }

    const currentUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      throw new ForbiddenException('Foydalanuvchi topilmadi');
    }

    const currentRole = currentUser.role;
    if (creatingRole === Role.ADMIN) {
      throw new ForbiddenException('ADMIN yaratish mumkin emas');
    }
  

    return true;
  }
}
