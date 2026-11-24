import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service.js';
import { User } from './user.entity.js';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserInput } from './user-input.js';

type CreateUserInput = Pick<User, 'firstname' | 'lastname' | 'age'>;
type UpdateUserInput = Partial<CreateUserInput>;

@ApiTags('users')
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({
    description: 'List of all users retrieved successfully.',
  })
  getAll(): Promise<User[]> {
    return this.usersService.getAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The user has been successfully retrieved.',
  })
  getById(@Param('id') id: string): Promise<User> {
    return this.usersService.getById(Number(id));
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  create(@Body() input: UserInput): Promise<User> {
    return this.usersService.create(input.firstname, input.lastname, input.age, input.password);
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
  })
  update(
    @Param('id') id: string,
    @Body() input: UpdateUserInput,
  ): Promise<User> {
    return this.usersService.update(Number(id), input);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
  })
  remove(@Param('id') id: string): Promise<boolean> {
    return this.usersService.remove(Number(id));
  }
}
