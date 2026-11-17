import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';
import { UsersService } from './users.service.js';

const createRepositoryMock = () => ({
  find: vi.fn(),
  findOneBy: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
});

describe('UsersService', () => {
  let repository: ReturnType<typeof createRepositoryMock>;
  let service: UsersService;

  beforeEach(() => {
    repository = createRepositoryMock();
    service = new UsersService(repository as unknown as Repository<User>);
  });

  describe('getAll', () => {
    it('should return all users from the repository', async () => {
      const expected: User[] = [
        { id: 1, firstname: 'John', lastname: 'Doe', age: 23 },
      ];
      repository.find.mockResolvedValue(expected);

      await expect(service.getAll()).resolves.toEqual(expected);
      expect(repository.find).toHaveBeenCalledOnce();
    });
  });

  describe('getById', () => {
    it('should return the matching user', async () => {
      const expected: User = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        age: 23,
      };
      repository.findOneBy.mockResolvedValue(expected);

      await expect(service.getById(1)).resolves.toEqual(expected);
      expect(repository.findOneBy).toHaveBeenCalledOnce();
    });

    it('should return a 404 error when the user does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.getById(99)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('create', () => {
    it('should create and save a user', async () => {
      const input = { firstname: 'Jane', lastname: 'Doe', age: 25 };
      const created: User = { id: 2, ...input };
      repository.create.mockReturnValue(created);
      repository.save.mockResolvedValue(created);

      await expect(
        service.create(input.firstname, input.lastname, input.age),
      ).resolves.toEqual(created);
      expect(repository.create).toHaveBeenCalledWith(input);
      expect(repository.save).toHaveBeenCalledWith(created);
    });
  });

  describe('update', () => {
    it('should update and save the matching user', async () => {
      const user: User = {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        age: 23,
      };
      repository.findOneBy.mockResolvedValue(user);
      repository.save.mockImplementation(async (updatedUser) => updatedUser);

      await expect(
        service.update(1, { firstname: 'Janette', age: 32 }),
      ).resolves.toEqual({
        id: 1,
        firstname: 'Janette',
        lastname: 'Doe',
        age: 32,
      });
      expect(repository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('remove', () => {
    it('should return true when the user is deleted', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should return a 404 error when the user does not exist', async () => {
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(99)).rejects.toBeInstanceOf(HttpException);
    });
  });
});
