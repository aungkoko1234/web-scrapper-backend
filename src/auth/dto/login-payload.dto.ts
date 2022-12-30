import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class LoginPayloadDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
