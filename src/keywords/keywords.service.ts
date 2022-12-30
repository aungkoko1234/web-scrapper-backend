import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { KeyWordDto } from './dto/keyword.dto';
import { KeyWord } from './entity/keyword.entity';

@Injectable()
export class KeywordsService {
  constructor(
    @InjectRepository(KeyWord, 'db_read')
    private readRepository: Repository<KeyWord>,
    @InjectRepository(KeyWord, 'db_write')
    private writeRepository: Repository<KeyWord>,
  ) {}

  async getAll(
    options: IPaginationOptions,
    search?: string,
    orderBy = 'created',
    order: 'DESC' | 'ASC' = 'DESC',
  ): Promise<Pagination<KeyWord>> {
    try {
      const builder = this.readRepository.createQueryBuilder('keyword');
      if (search) {
        builder.andWhere(`keyword.name LIKE :name`, {
          name: `%${search}%`,
        });
      }
      builder.orderBy('keyword.' + orderBy, order);
      return paginate<KeyWord>(builder, options);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async create(payload: KeyWordDto): Promise<KeyWord> {
    try {
      const keyword = new KeyWord();
      keyword.id = nanoid();
      keyword.name = payload.name;
      keyword.createdBy = payload.createdBy;
      return this.writeRepository.save(keyword);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
