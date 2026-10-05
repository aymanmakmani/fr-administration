import { All, Controller, Get } from '@nestjs/common';
import { User } from './user.entity.js';

const users : User[] = [
    {
        id: 0,
        lastname: 'Doe',
        firstname: 'John'
    }
]
@Controller('users')
export class UsersController {
  @Get('all')
  getAll(): string[] {
    return ['a', 'b', 'c'];
  }
}