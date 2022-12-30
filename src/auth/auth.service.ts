import { RegisterPayloadDto } from './dto/register-payload.dto';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(username);

    const isEqual = await this.usersService.comparePassword(username, password);

    if (!isEqual) {
      throw new BadRequestException('Password or email are incorrect');
      // return getResponseFormat(400, 'Authentication Failed', {
      // 	message: 'Email or Password are incorrect',
      // });
    }

    return user;
  }

  async getProfile(id: string): Promise<User> {
    const account = await this.usersService.getDetail(id);
    if (!account) {
      throw new UnauthorizedException('Account user not found');
    }
    return account;
  }

  async generateAuthToken({ id, email, userName }: User): Promise<string> {
    return this.jwtService.sign({
      accountId: id,
      email,
      username: userName,
    });
  }

  async register({ email, ...payload }: RegisterPayloadDto): Promise<User> {
    const existed = await this.usersService.findByEmail(email);
    if (existed) {
      throw new BadRequestException('this account had already registered');
    }

    return this.usersService.create({ email, ...payload });
  }
}
