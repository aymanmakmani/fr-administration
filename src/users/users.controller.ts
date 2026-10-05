import { All, Controller, Get , Body , Post , Param ,HttpStatus ,HttpException  } from '@nestjs/common';
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
  @Get()
  getAll(): User[] {
     return users;
  }
  @Post()
  create(@Body() input: any): User {
    
    const newUser = new User(users.length, input.lastname, input.firstname);
    users.push(newUser);
    return newUser;
  }
  @Get(':id')
  getById(@Param() parameter: any): User {
    const userId = +parameter.id;
    const user = users.find((u) => u.id === userId);

    if (user != undefined) {
      return user;
    }

    
    throw new HttpException(
      `Could not find a user with the id ${parameter.id}`,
      HttpStatus.NOT_FOUND,
    );
}

}

