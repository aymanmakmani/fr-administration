import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Association } from './association.entity.js';
import { AssociationsController } from './associations.controller.js';
import { AssociationsService } from './associations.service.js';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';

const repositoryMockFactory = () => ({
  find: vi.fn(),
  findOneBy: vi.fn(),
  create: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
});

describe('AssociationsController', () => {
  let controller: AssociationsController;
  let service: AssociationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssociationsController],
      providers: [
        AssociationsService,
        {
          provide: getRepositoryToken(Association),
          useFactory: repositoryMockFactory,
        },
        {
          provide: UsersService,
          useValue: { getById: vi.fn() },
        },
      ],
    }).compile();

    service = module.get<AssociationsService>(AssociationsService);
    controller = module.get<AssociationsController>(AssociationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of associations', async () => {
      const expected: Association[] = [
        { id: 1, name: 'Association de test', users: [] },
      ];
      vi.spyOn(service, 'getAll').mockResolvedValue(expected);

      await expect(controller.getAll()).resolves.toEqual(expected);
    });
  });

  describe('getById', () => {
    it('should return the association with the provided id', async () => {
      const expected: Association = {
        id: 1,
        name: 'Association de test',
        users: [],
      };
      vi.spyOn(service, 'getById').mockResolvedValue(expected);

      await expect(controller.getById('1')).resolves.toEqual(expected);
      expect(service.getById).toHaveBeenCalledWith(1);
    });
  });

  describe('getMembers', () => {
    it('should return the users belonging to the association', async () => {
      const expected: User[] = [
        { id: 1, firstname: 'John', lastname: 'Doe', age: 23 },
      ];
      vi.spyOn(service, 'getMembers').mockResolvedValue(expected);

      await expect(controller.getMembers('1')).resolves.toEqual(expected);
      expect(service.getMembers).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return an association', async () => {
      const input = { name: 'Association de test', idUsers: [1, 2] };
      const expected: Association = {
        id: 1,
        name: input.name,
        users: [],
      };
      vi.spyOn(service, 'create').mockResolvedValue(expected);

      await expect(controller.create(input)).resolves.toEqual(expected);
      expect(service.create).toHaveBeenCalledWith(input.name, input.idUsers);
    });
  });

  describe('update', () => {
    it('should update and return an association', async () => {
      const input = { name: 'Association mise à jour', idUsers: [2] };
      const expected: Association = {
        id: 1,
        name: input.name,
        users: [],
      };
      vi.spyOn(service, 'update').mockResolvedValue(expected);

      await expect(controller.update('1', input)).resolves.toEqual(expected);
      expect(service.update).toHaveBeenCalledWith(1, input);
    });
  });

  describe('remove', () => {
    it('should remove an association', async () => {
      vi.spyOn(service, 'remove').mockResolvedValue(true);

      await expect(controller.remove('1')).resolves.toBe(true);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
