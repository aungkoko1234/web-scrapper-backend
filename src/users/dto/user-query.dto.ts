import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../shared/utils/dto/pagination.dto';

export class UserQueryDto extends PaginationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly orderBy?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly order?: string;
}
