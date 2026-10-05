import { All, Controller, Get , Body , Post } from '@nestjs/common';
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
  @Post()
  create(@Body() input: any): User {
    
    const newUser = new User(users.link, input.lastname, input.firstname);
    users.push(newUser);
    return newUser;
  }
}

