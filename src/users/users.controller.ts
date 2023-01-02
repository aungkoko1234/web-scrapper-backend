import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParamCodeDto } from 'src/shared/utils/dto/param-code.dto';
import { getResponseFormat } from 'src/shared/utils/misc';
import { CreateUserDto } from './dto/create-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get User List',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getUsers(@Query() { page = 1, limit = 10, ...payload }: UserQueryDto) {
    return getResponseFormat(
      0,
      'Get User List',
      await this.usersService.getAll(
        { page, limit },
        payload.search,
        payload.orderBy,
        payload.order === 'asc' ? 'ASC' : 'DESC',
      ),
    );
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() payload: CreateUserDto) {
    return getResponseFormat(
      0,
      'Create User',
      await this.usersService.create(payload),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete User' })
  async delete(@Param() { id }: ParamCodeDto) {
    return getResponseFormat(
      0,
      'Delete User',
      await this.usersService.delete(id),
    );
  }
}
