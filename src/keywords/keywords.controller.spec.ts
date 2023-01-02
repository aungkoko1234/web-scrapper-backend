import { Test, TestingModule } from '@nestjs/testing';
import { HelpersService } from '../helpers/helpers.service';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './keywords.service';

describe('KeywordsController', () => {
  let controller: KeywordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KeywordsController],
      providers: [
        {
          provide: KeywordsService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
              {
                name: 'Job',
                createdBy: '1abcdef',
                adsWordCount: 20,
                linkCount: 70,
                searchResultCount: '2300000',
                htmlSource: '',
              },
              {
                name: 'Flight Ticket',
                createdBy: '1abcdef',
                adsWordCount: 20,
                linkCount: 70,
                searchResultCount: '2300000',
                htmlSource: '',
              },
            ]),
            deleteOne: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
        {
          provide: HelpersService,
          useValue: {
            get: jest.fn().mockRejectedValue([]),
          },
        },
        {
          provide: 'BullQueue_keywords',
          useValue: {
            get: jest.fn().mockRejectedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<KeywordsController>(KeywordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllKeyWords', () => {
    it('should get an array of keywords', async () => {
      await expect(
        controller.getUsers({ limit: 10, page: 1 }),
      ).resolves.toEqual({
        data: [
          {
            adsWordCount: 20,
            createdBy: '1abcdef',
            htmlSource: '',
            linkCount: 70,
            name: 'Job',
            searchResultCount: '2300000',
          },
          {
            adsWordCount: 20,
            createdBy: '1abcdef',
            htmlSource: '',
            linkCount: 70,
            name: 'Flight Ticket',
            searchResultCount: '2300000',
          },
        ],
        error: null,
        message: 'Get Keyword List',
        statusCode: 0,
      });
    });
  });
});
