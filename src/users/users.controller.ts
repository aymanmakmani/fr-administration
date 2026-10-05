import { All, Controller, Get , Body , Post , Param ,HttpStatus ,HttpException , Put , Delete } from '@nestjs/common';
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
  @Put(':id')
  update(@Param() parameter: any, @Body() input: any): User {
    const result = users.filter(user => user.id === +parameter.id);
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
      `Could not find a user with the id ${parameter.id}`,
      HttpStatus.NOT_FOUND,
    );
  }

  @Delete(':id')
  remove(@Param() parameter: any): boolean {
    const index = users.findIndex(user => user.id === +parameter.id);
    if (index !== -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  }

}
