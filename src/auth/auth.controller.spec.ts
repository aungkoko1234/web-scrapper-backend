import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              accessToken: 'mock accessToken',
              profile: {
                name: 'Mock User',
                email: 'mockuser@gmail.com',
                id: 'abc1234',
                created: new Date(),
                updated: new Date(),
              },
            }),
            generateAuthToken: jest.fn().mockRejectedValue({
              accessToken: 'mock accessToken',
              profile: {
                name: 'Mock User',
                email: 'mockuser@gmail.com',
                id: 'abc1234',
              },
            }),
            register: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
