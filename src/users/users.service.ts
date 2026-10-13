import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 0,
      lastname: 'Doe',
      firstname: 'John',
      age: 23 ,
    },
  ];

  getAll(): User[] {
    return this.users;
  }

  getById(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (user != undefined) {
      return user;
    }
    throw new HttpException(
      `Could not find a user with the id ${id}`,
      HttpStatus.NOT_FOUND,
    );
  }

  create(firstname: string, lastname: string , age: number): User {
    const newUser = new User(this.users.length, lastname, firstname , age);
    this.users.push(newUser);
    return newUser;
  }

  update(id: number, input: any): User {
    const result = this.users.filter((user) => user.id === id);
    const user = result[0];

    if (user) {
      if (input.lastname !== undefined) {
        user.lastname = input.lastname;
      }
      if (input.firstname !== undefined) {
        user.firstname = input.firstname;
      }
      return user;
    }

    throw new HttpException(
      `Could not find a user with the id ${id}`,
      HttpStatus.NOT_FOUND,
    );
  }

  remove(id: number): boolean {
    const index = this.users.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    throw new HttpException(
      `Could not find a user with the id ${id}`,
      HttpStatus.NOT_FOUND,
    );
  }
}