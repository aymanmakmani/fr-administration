import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { User } from '../users/user.entity.js';
import { Association } from './association.entity.js';
import { AssociationsService } from './associations.service.js';


export class CreateAssociationInput {
  @ApiProperty({
    description: 'The name of the association',
    example: 'Club Informatique',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'List of user IDs associated with the club',
    example: [1, 2],
    required: false,
    type: [Number],
  })
  idUsers?: number[];
}


export class UpdateAssociationInput {
  @ApiProperty({
    description: 'The name of the association',
    example: 'Club Robotique',
    required: false,
    type: String,
  })
  name?: string;

  @ApiProperty({
    description: 'List of user IDs',
    example: [1],
    required: false,
    type: [Number],
  })
  idUsers?: number[];
}

@ApiTags('associations') 
@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Get()
  @ApiOkResponse({ description: 'List of all associations retrieved successfully.' })
  getAll(): Promise<Association[]> {
    return this.associationsService.getAll();
  }

  @Get(':id/members')
  @ApiOkResponse({ description: 'List of members retrieved successfully.' })
  getMembers(@Param('id') id: string): Promise<User[]> {
    return this.associationsService.getMembers(Number(id));
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Association retrieved successfully.' })
  getById(@Param('id') id: string): Promise<Association> {
    return this.associationsService.getById(Number(id));
  }

  @Post()
  @ApiCreatedResponse({ description: 'The association has been successfully created.' })
  create(@Body() input: CreateAssociationInput): Promise<Association> {
    return this.associationsService.create(input.name, input.idUsers ?? []);
  }

  @Put(':id')
  @ApiOkResponse({ description: 'The association has been successfully updated.' })
  update(
    @Param('id') id: string,
    @Body() input: UpdateAssociationInput,
  ): Promise<Association> {
    return this.associationsService.update(Number(id), input);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The association has been successfully deleted.' })
  remove(@Param('id') id: string): Promise<boolean> {
    return this.associationsService.remove(Number(id));
  }
}