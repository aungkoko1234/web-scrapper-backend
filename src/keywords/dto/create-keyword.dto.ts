import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateKeywordDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
