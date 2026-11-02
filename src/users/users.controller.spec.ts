import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller.js';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';

const repositoryMockFactory = () => ({
  find: vi.fn(),
  findOneBy: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
});

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of users', async () => {
      const expected: User[] = [
        { id: 1, firstname: 'John', lastname: 'Doe', age: 23 },
      ];
      vi.spyOn(service, 'getAll').mockResolvedValue(expected);

      await expect(controller.getAll()).resolves.toEqual(expected);
    });
  });

  describe('getById', () => {
    it('should return the user with the provided id', async () => {
      const expected: User = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        age: 23,
      };
      vi.spyOn(service, 'getById').mockResolvedValue(expected);

      await expect(controller.getById('1')).resolves.toEqual(expected);
      expect(service.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const input = { firstname: 'Jane', lastname: 'Doe', age: 25 };
      const expected: User = { id: 2, ...input };
      vi.spyOn(service, 'create').mockResolvedValue(expected);

      await expect(controller.create(input)).resolves.toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(
        input.firstname,
        input.lastname,
        input.age,
      );
    });
  });

  describe('update', () => {
    it('should update and return a user', async () => {
      const input = { firstname: 'Janette', age: 32 };
      const expected: User = {
        id: 1,
        firstname: 'Janette',
        lastname: 'Doe',
        age: 32,
      };
      vi.spyOn(service, 'update').mockResolvedValue(expected);

      await expect(controller.update('1', input)).resolves.toEqual(expected);
      expect(service.update).toHaveBeenCalledWith(1, input);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      vi.spyOn(service, 'remove').mockResolvedValue(true);

      await expect(controller.remove('1')).resolves.toBe(true);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
