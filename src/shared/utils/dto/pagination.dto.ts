import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto implements IPaginationOptions {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  readonly page: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  readonly limit: number;
}
