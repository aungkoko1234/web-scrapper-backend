import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { genSaltSync, hashSync, compare } from 'bcryptjs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entity/user.entity';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'db_read')
    private readRepository: Repository<User>,
    @InjectRepository(User, 'db_write')
    private writeRepository: Repository<User>,
  ) {}

  async getAll(
    options: IPaginationOptions,
    search?: string,
    orderBy = 'created',
    order: 'DESC' | 'ASC' = 'DESC',
  ): Promise<Pagination<User>> {
    try {
      const builder = this.readRepository.createQueryBuilder('user');
      if (search) {
        builder.andWhere(`user.userName LIKE :name`, {
          name: `%${search}%`,
        });
      }
      builder.orderBy('user.' + orderBy, order);
      return paginate<User>(builder, options);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async create(payload: CreateUserDto): Promise<User> {
    const existEmail = await this.readRepository.findOne({
      where: { email: payload.email },
    });
    if (existEmail) {
      throw new BadRequestException(
        `Email ${payload.email} has been taken. Try other email`,
      );
    }
    try {
      const user = new User();
      user.id = nanoid();
      user.userName = payload.userName;
      user.email = payload.email;
      const salt = genSaltSync(10);
      user.password = hashSync(payload.password, salt);
      return this.writeRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async comparePassword(email: string, password: string) {
    try {
      const user = await this.readRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', {
          email,
        })
        .getOne();
      return await compare(password, user.password);
    } catch (error) {
      throw new Error(error);
    }
  }

  async updatePassword(
    id: string,
    { password, newPassword }: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.readRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', {
        id,
      })
      .getOne();
    const isEqual = await compare(password, user.password);
    if (!isEqual) {
      throw new BadRequestException(`Password is worng.`);
    }
    try {
      const salt = genSaltSync(10);
      user.password = hashSync(newPassword, salt);
      return this.writeRepository.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDetail(id: string): Promise<User> {
    try {
      return this.readRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, payload: CreateUserDto): Promise<User> {
    const user = await this.readRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User Not Found`);
    }
    try {
      user.email = payload.email;
      user.userName = payload.userName;
      return this.writeRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(id: string): Promise<DeleteResult> {
    try {
      return this.writeRepository.delete({ id });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
