import { PartialType } from '@nestjs/swagger';
import { CreateUserOtpDto } from './create-user-otp.dto';

export class UpdateUserOtpDto extends PartialType(CreateUserOtpDto) {}
