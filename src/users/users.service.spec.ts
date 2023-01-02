import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMock } from '@golevelup/ts-jest';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';

const userArray = [
  {
    id: '1abcdef',
    name: 'John',
    email: 'john@gmail.com',
    password: '12345678',
  },
  {
    id: '1abcdefg',
    name: 'Mike',
    email: 'mike@gmail.com',
    password: '12345678',
  },
];

const oneUser = {
  id: '1abcdefg',
  name: 'Mike',
  email: 'mike@gmail.com',
  password: '12345678',
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: 'db_read_UserRepository',
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: 'db_write_UserRepository',
          useValue: createMock<Repository<User>>(),
        },
        {
          provide: getRepositoryToken(User),
          // define all the methods that you use from the catRepo
          // give proper return values as expected or mock implementations, your choice
          useValue: {
            find: jest.fn().mockResolvedValue(userArray),
            findOne: jest.fn().mockResolvedValue(oneUser),
            create: jest.fn().mockReturnValue(oneUser),
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

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
