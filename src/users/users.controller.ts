import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from './user.entity.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(): User[] {
    return this.usersService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string): User {
    return this.usersService.getById(+id);
  }

  @Post()
  create(@Body() input: any): User {
    return this.usersService.create(input.firstname, input.lastname);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() input: any): User {
    return this.usersService.update(+id, input);
  }

  @Delete(':id')
  remove(@Param('id') id: string): boolean {
    return this.usersService.remove(+id);
  }
}