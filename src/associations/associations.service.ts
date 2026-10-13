import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/user.entity.js';
import { UsersService } from '../users/users.service.js';
import { Association } from './association.entity.js';

@Injectable()
export class AssociationsService {
  constructor(private readonly usersService: UsersService) {}

  private readonly associations: Association[] = [
    new Association(0, 'Association de démonstration', [0]),
  ];

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
    const association = this.getById(id);
    return association.idUsers.map((userId) => this.usersService.getById(userId));
  }

  create(name: string, idUsers: number[] = []): Association {
    const id = this.associations.reduce(
      (maxId, association) => Math.max(maxId, association.id),
      -1,
    ) + 1;
    const association = new Association(id, name, idUsers);
    this.associations.push(association);
    return association;
  }

  update(id: number, input: Partial<Pick<Association, 'name' | 'idUsers'>>): Association {
    const association = this.getById(id);

    if (input.name !== undefined) {
      association.name = input.name;
    }
    if (input.idUsers !== undefined) {
      association.idUsers = input.idUsers;
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
