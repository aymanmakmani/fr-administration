import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { Association } from './association.entity.js';
import { AssociationsService } from './associations.service.js';

const createRepositoryMock = () => ({
  find: vi.fn(),
  findOneBy: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
});

describe('AssociationsService', () => {
  let repository: ReturnType<typeof createRepositoryMock>;
  let usersService: Pick<UsersService, 'getById'>;
  let service: AssociationsService;

  beforeEach(() => {
    repository = createRepositoryMock();
    usersService = { getById: vi.fn() };
    service = new AssociationsService(
      repository as unknown as Repository<Association>,
      usersService as UsersService,
    );
  });

  describe('getAll', () => {
    it('should return all associations from the repository', async () => {
      const expected: Association[] = [
        { id: 1, name: 'Association de test', users: [] },
      ];
      repository.find.mockResolvedValue(expected);

      await expect(service.getAll()).resolves.toEqual(expected);
      expect(repository.find).toHaveBeenCalledOnce();
    });
  });

  describe('getById', () => {
    it('should return the matching association', async () => {
      const expected: Association = {
        id: 1,
        name: 'Association de test',
        users: [],
      };
      repository.findOneBy.mockResolvedValue(expected);

      await expect(service.getById(1)).resolves.toEqual(expected);
      expect(repository.findOneBy).toHaveBeenCalledOnce();
    });

    it('should return a 404 error when the association does not exist', async () => {
      repository.findOneBy.mockResolvedValue(null);

      await expect(service.getById(99)).rejects.toMatchObject({ status: 404 });
    });
  });

  describe('getMembers', () => {
    it('should return the association users', async () => {
      const members: User[] = [
        { id: 1, firstname: 'John', lastname: 'Doe', age: 23 },
      ];
      repository.findOneBy.mockResolvedValue({
        id: 1,
        name: 'Association de test',
        users: members,
      });

      await expect(service.getMembers(1)).resolves.toEqual(members);
    });
  });

  describe('create', () => {
    it('should resolve user ids, create, and save the association', async () => {
      const users: User[] = [
        { id: 1, firstname: 'John', lastname: 'Doe', age: 23 },
        { id: 2, firstname: 'Jane', lastname: 'Doe', age: 25 },
      ];
      vi.mocked(usersService.getById)
        .mockResolvedValueOnce(users[0])
        .mockResolvedValueOnce(users[1]);
      const association: Association = {
        id: 1,
        name: 'Association de test',
        users,
      };
      repository.create.mockReturnValue(association);
      repository.save.mockResolvedValue(association);

      await expect(
        service.create('Association de test', [1, 2]),
      ).resolves.toEqual(association);
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Association de test',
        users,
      });
      expect(repository.save).toHaveBeenCalledWith(association);
    });
  });

  describe('update', () => {
    it('should update and save the association and its members', async () => {
      const association: Association = {
        id: 1,
        name: 'Ancienne association',
        users: [],
      };
      const user: User = {
        id: 2,
        firstname: 'Jane',
        lastname: 'Doe',
        age: 25,
      };
      repository.findOneBy.mockResolvedValue(association);
      vi.mocked(usersService.getById).mockResolvedValue(user);
      repository.save.mockImplementation(
        async (updatedAssociation) => updatedAssociation,
      );

      await expect(
        service.update(1, { name: 'Nouvelle association', idUsers: [2] }),
      ).resolves.toEqual({
        id: 1,
        name: 'Nouvelle association',
        users: [user],
      });
      expect(repository.save).toHaveBeenCalledWith(association);
    });
  });

  describe('remove', () => {
    it('should return true when the association is deleted', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });

      await expect(service.remove(1)).resolves.toBe(true);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should return a 404 error when the association does not exist', async () => {
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(99)).rejects.toBeInstanceOf(HttpException);
    });
  });
});
