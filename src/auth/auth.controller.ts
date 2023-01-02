import { RegisterPayloadDto } from './dto/register-payload.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { getResponseFormat } from '../shared/utils/misc';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Account Login',
  })
  @Post('sign-in')
  async login(@Body() payload: LoginPayloadDto, @Request() req) {
    return getResponseFormat(0, 'success login', {
      accessToken: await this.authService.generateAuthToken(req.user),
      profile: req.user,
    });
  }

  @ApiOperation({
    summary: 'To register with email and password',
  })
  @Post('sign-up')
  @HttpCode(200)
  async register(@Body() payload: RegisterPayloadDto) {
    const { password, ...account } = await this.authService.register(payload);
    return getResponseFormat(0, 'Account Creation', { account });
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return getResponseFormat(0, 'authenticated profile', req.user);
  }
}
