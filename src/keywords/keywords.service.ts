import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { KeywordStatus } from 'src/shared/utils/constant';
import { Repository, UpdateResult } from 'typeorm';
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

  async create({
    name,
    createdBy,
    adsWordCount,
    linkCount,
    searchResultCount,
    htmlSource,
  }: KeyWordDto): Promise<KeyWord> {
    try {
      const keyword = new KeyWord();
      keyword.id = nanoid();
      keyword.name = name;
      keyword.createdBy = createdBy;
      keyword.adsWordCount = adsWordCount;
      keyword.linkCount = linkCount;
      keyword.searchResultCount = searchResultCount;
      keyword.htmlSource = htmlSource;
      return this.writeRepository.save(keyword);
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateStatus(id: string, status: KeywordStatus): Promise<UpdateResult> {
    try {
      return this.writeRepository.update({ id }, { status });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(
    id: string,
    {
      adsWordCount,
      status,
      linkCount,
      searchResultCount,
      htmlSource,
    }: Partial<KeyWordDto>,
  ): Promise<KeyWord> {
    const keyword = await this.readRepository.findOne({ where: { id } });
    if (!keyword) {
      throw new NotFoundException(`Keyword Id ${id} is not found`);
    }
    try {
      keyword.adsWordCount = adsWordCount;
      keyword.linkCount = linkCount;
      keyword.searchResultCount = searchResultCount;
      keyword.htmlSource = htmlSource;
      keyword.status = status;
      return this.writeRepository.save(keyword);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<KeyWord> {
    try {
      return this.readRepository.findOne({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
