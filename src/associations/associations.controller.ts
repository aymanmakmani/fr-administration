import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from '../users/user.entity.js';
import { Association } from './association.entity.js';
import { AssociationsService } from './associations.service.js';

type CreateAssociationInput = { name: string; idUsers?: number[] };
type UpdateAssociationInput = { name?: string; idUsers?: number[] };

@Controller('associations')
export class AssociationsController {
  constructor(private readonly associationsService: AssociationsService) {}

  @Get()
  getAll(): Promise<Association[]> {
    return this.associationsService.getAll();
  }

  @Get(':id/members')
  getMembers(@Param('id') id: string): Promise<User[]> {
    return this.associationsService.getMembers(Number(id));
  }

  @Get(':id')
  getById(@Param('id') id: string): Promise<Association> {
    return this.associationsService.getById(Number(id));
  }

  @Post()
  create(@Body() input: CreateAssociationInput): Promise<Association> {
    return this.associationsService.create(input.name, input.idUsers ?? []);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() input: UpdateAssociationInput,
  ): Promise<Association> {
    return this.associationsService.update(Number(id), input);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.associationsService.remove(Number(id));
  }
}
