import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { Association } from './association.entity.js';

@Injectable()
export class AssociationsService {
  private readonly associations: Association[];

  constructor(private readonly usersService: UsersService) {
    this.associations = [new Association(0, 'Association de démonstration')];
  }

  getAll(): Association[] {
    return this.associations;
  }

  getById(id: number): Association {
    const association = this.associations.find((item) => item.id === id);

    if (!association) {
      throw new HttpException(
        `Could not find an association with the id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return association;
  }

  getMembers(id: number): User[] {
    return this.getById(id).users;
  }

  async create(name: string, idUsers: number[] = []): Promise<Association> {
    const id =
      this.associations.reduce(
        (maxId, association) => Math.max(maxId, association.id),
        -1,
      ) + 1;
    const users = await Promise.all(
      idUsers.map((userId) => this.usersService.getById(userId)),
    );
    const association = new Association(id, name, users);
    this.associations.push(association);
    return association;
  }

  async update(
    id: number,
    input: { name?: string; idUsers?: number[] },
  ): Promise<Association> {
    const association = this.getById(id);

    if (input.name !== undefined) {
      association.name = input.name;
    }
    if (input.idUsers !== undefined) {
      association.users = await Promise.all(
        input.idUsers.map((userId) => this.usersService.getById(userId)),
      );
    }

    return association;
  }

  remove(id: number): boolean {
    const index = this.associations.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new HttpException(
        `Could not find an association with the id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    this.associations.splice(index, 1);
    return true;
  }
}
