import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from './user.entity.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async getAll(): Promise<User[]> {
    return this.repository.find();
  }

  async getById(id: number): Promise<User> {
    const user = await this.repository.findOneBy({ id: Equal(id) });

    if (user) {
      return user;
    }

    throw new HttpException(
      `Could not find a user with the id ${id}`,
      HttpStatus.NOT_FOUND,
    );
  }

  async create(
    firstname: string,
    lastname: string,
    age: number,
  ): Promise<User> {
    const user = this.repository.create({ firstname, lastname, age });
    return this.repository.save(user);
  }

  async update(
    id: number,
    input: Partial<Pick<User, 'firstname' | 'lastname' | 'age'>>,
  ): Promise<User> {
    const user = await this.getById(id);

    if (input.lastname !== undefined) {
      user.lastname = input.lastname;
    }
    if (input.firstname !== undefined) {
      user.firstname = input.firstname;
    }
    if (input.age !== undefined) {
      user.age = input.age;
    }

    return this.repository.save(user);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);

    if (result.affected) {
      return true;
    }

    throw new HttpException(
      `Could not find a user with the id ${id}`,
      HttpStatus.NOT_FOUND,
    );
  }
}
