import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { Association } from './association.entity.js';

@Injectable()
export class AssociationsService {
  constructor(
    @InjectRepository(Association)
    private readonly repository: Repository<Association>,
    private readonly usersService: UsersService,
  ) {}

  async getAll(): Promise<Association[]> {
    return this.repository.find();
  }

  async getById(id: number): Promise<Association> {
    const association = await this.repository.findOneBy({ id: Equal(id) });

    if (!association) {
      throw new HttpException(
        `Could not find an association with the id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return association;
  }

  async getMembers(id: number): Promise<User[]> {
    return (await this.getById(id)).users;
  }

  async create(name: string, idUsers: number[] = []): Promise<Association> {
    const users = await Promise.all(
      idUsers.map((userId) => this.usersService.getById(userId)),
    );
    const association = this.repository.create({ name, users });
    return this.repository.save(association);
  }

  async update(
    id: number,
    input: { name?: string; idUsers?: number[] },
  ): Promise<Association> {
    const association = await this.getById(id);

    if (input.name !== undefined) {
      association.name = input.name;
    }
    if (input.idUsers !== undefined) {
      association.users = await Promise.all(
        input.idUsers.map((userId) => this.usersService.getById(userId)),
      );
    }

    return this.repository.save(association);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    if (result.affected) {
      return true;
    }

    throw new HttpException(
      `Could not find an association with the id ${id}`,
      HttpStatus.NOT_FOUND,
    );
  }
}
