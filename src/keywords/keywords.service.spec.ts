import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeywordsService } from './keywords.service';
import { KeyWord } from './entity/keyword.entity';
import { createMock } from '@golevelup/ts-jest';

const keywordArray = [
  {
    adsWordCount: 20,
    createdBy: '1abcdef',
    htmlSource: '',
    linkCount: 70,
    name: 'Job',
    searchResultCount: '2300000',
  },
  {
    adsWordCount: 21,
    createdBy: '1abcdeg',
    htmlSource: '',
    linkCount: 70,
    name: 'Flight Ticket',
    searchResultCount: '2300000',
  },
];

const oneKeyword = {
  id: '1fghij',
  adsWordCount: 22,
  createdBy: '1abcdeh',
  htmlSource: '',
  linkCount: 70,
  name: 'Flight Ticket',
  searchResultCount: '2300000',
};

describe('KeywordsService', () => {
  let service: KeywordsService;
  let repo: Repository<KeyWord>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KeywordsService,
        {
          provide: 'db_read_KeyWordRepository',
          useValue: createMock<Repository<KeyWord>>(),
        },
        {
          provide: 'db_write_KeyWordRepository',
          useValue: createMock<Repository<KeyWord>>(),
        },
        {
          provide: getRepositoryToken(KeyWord),
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            find: jest.fn().mockResolvedValue(keywordArray),
            findOne: jest.fn().mockResolvedValue(oneKeyword),
            create: jest.fn().mockReturnValue(oneKeyword),
            // save: jest.fn(),
            // // as these do not actually use their return values in our sample
            // // we just make sure that their resolve is true to not crash
            // update: jest.fn().mockResolvedValue(true),
            // // as these do not actually use their return values in our sample
            // // we just make sure that their resolve is true to not crash
            // delete: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    service = module.get<KeywordsService>(KeywordsService);
    repo = module.get<Repository<KeyWord>>(getRepositoryToken(KeyWord));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
