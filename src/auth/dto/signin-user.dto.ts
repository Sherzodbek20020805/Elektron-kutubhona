import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SigninUserDto {
  @ApiProperty({ example: 'johndoe@gmail.com' })
  @IsString()
  readonly email: string;
  @ApiProperty({ example: 'MySecureP@ss1' })
  @IsString()
  readonly password: string;
}
