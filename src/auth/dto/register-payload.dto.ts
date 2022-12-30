import { IsEmail } from 'class-validator';
import { IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class RegisterPayloadDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
