import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ResetPasswordDto } from './dto/resetPasswordDto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { CookieGetter, GetCurrentUserId, Public, RefreshTokenGuard } from '../common';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminGuard } from '../common/guards/super_admin.guard';
import { JwtGuard } from '../common/guards/jwt.guard';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Foydalanuvchini ro'yxatdan o'tkazish
  @Post('signUp')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  // Tizimga kirish
  @HttpCode(200)
  @Post('signIn')
  signIn(
    @Body() signInUserDto: SigninUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(signInUserDto, res);
  }

  // Tizimdan chiqish
  @HttpCode(200)
  @Post('signOut')
  signOut(
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signOut(refreshToken, res);
  }

  // Tokenni yangilash
  @Post('refresh')
@Public()
@UseGuards(RefreshTokenGuard)
async refreshTokens(
  @GetCurrentUserId() userId: number,
  @CookieGetter('refreshToken') refreshToken: string,
  @Res({ passthrough: true }) res: Response,
) {
    return this.authService.refresh_token(userId, refreshToken, res);
}


  // Parolni tiklash (kodni tekshirib, yangi parol o'rnatish)
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPasswordWithConfirm(dto);
  }

  // Parolni unutgan foydalanuvchiga tiklash havolasini yuborish
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.sendResetPasswordToken(dto.email);
  }
}
