import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KeywordStatus } from 'src/shared/utils/constant';
import { Repository } from 'typeorm';
import { KeyWord } from './entity/keyword.entity';
import { KeywordsService } from './keywords.service';

describe('KeyWords using createMock with DI', () => {
  let repo: Repository<KeyWord>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        KeywordsService,
        {
          provide: getRepositoryToken(KeyWord),
          useValue: createMock<Repository<KeyWord>>(),
        },
        {
          provide: 'db_read_KeyWordRepository',
          useValue: createMock<Repository<KeyWord>>(),
        },
        {
          provide: 'db_write_KeyWordRepository',
          useValue: createMock<Repository<KeyWord>>(),
        },
      ],
    }).compile();

    // service = module.get<KeywordsService>(KeywordsService);
    repo = module.get<Repository<KeyWord>>(getRepositoryToken(KeyWord));
  });

  it('should have the repo mocked', () => {
    expect(typeof repo.find).toBe('function');
  });
});

describe('KeywordsService using createMock without DI', () => {
  const repo = createMock<Repository<KeyWord>>();

  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [
        KeywordsService,
        {
          provide: getRepositoryToken(KeyWord),
          useValue: repo,
        },
        {
          provide: 'db_read_KeyWordRepository',
          useValue: createMock<Repository<KeyWord>>(),
        },
        {
          provide: 'db_write_KeyWordRepository',
          useValue: createMock<Repository<KeyWord>>(),
        },
      ],
    }).compile();
  });

  it('should have the repo mocked', async () => {
    const keyword = {
      id: 'bh781z',
      adsWordCount: 20,
      createdBy: '1abcdef',
      htmlSource: '',
      linkCount: 70,
      name: 'Job',
      status: KeywordStatus.Completed,
      searchResultCount: '2300000',
      created: new Date(),
      updated: new Date(),
    };
    repo.find.mockResolvedValue([keyword]);
    // tslint:disable-next-line: no-invalid-await
    expect(await repo.find()).toEqual([keyword]);
  });
});
