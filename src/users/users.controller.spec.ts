import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getAll: jest.fn().mockResolvedValue([
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
            ]),
            delete: jest
              .fn()
              .mockResolvedValue({ raw: { deleted: true }, affected: 1 }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should get an array of users', async () => {
      await expect(
        controller.getUsers({ limit: 10, page: 1 }),
      ).resolves.toEqual({
        data: [
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
        ],
        error: null,
        message: 'Get User List',
        statusCode: 0,
      });
    });
  });
  describe('deleteUser', () => {
    it('should return that it deleted a user', async () => {
      await expect(controller.delete({ id: '1abcdef' })).resolves.toEqual({
        data: { raw: { deleted: true }, affected: 1 },
        error: null,
        message: 'Delete User',
        statusCode: 0,
      });
    });
    it('should return that it did not delete a user', async () => {
      const deleteSpy = jest
        .spyOn(service, 'delete')
        .mockResolvedValueOnce({ raw: { deleted: false }, affected: 0 });
      await expect(controller.delete({ id: '' })).resolves.toEqual({
        data: { raw: { deleted: false }, affected: 0 },
        error: null,
        message: 'Delete User',
        statusCode: 0,
      });
      expect(deleteSpy).toBeCalledWith('');
    });
  });
});
