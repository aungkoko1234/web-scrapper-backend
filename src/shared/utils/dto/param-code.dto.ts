import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ParamCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;
}
