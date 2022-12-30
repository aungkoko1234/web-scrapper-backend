import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
