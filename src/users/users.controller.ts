import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from './user.entity.js';

type CreateUserInput = Pick<User, 'firstname' | 'lastname' | 'age'>;
type UpdateUserInput = Partial<CreateUserInput>;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(Number(id));
  }

  @Post()
  create(@Body() input: CreateUserInput): Promise<User> {
    return this.usersService.create(input.firstname, input.lastname, input.age);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() input: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(Number(id), input);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.usersService.remove(Number(id));
  }
}
