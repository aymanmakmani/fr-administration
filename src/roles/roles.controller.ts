import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleInput } from './role.input.js';
import { RoleUpdate } from './role.update.js';
import { Role } from './role.entity.js';
import { RolesService } from './roles.service.js';

@ApiTags('roles')
@Controller('roles')
@UseGuards(AuthGuard('jwt'))
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOkResponse({ description: 'List of all roles retrieved successfully.' })
  getAll(): Promise<Role[]> {
    return this.rolesService.getAll();
  }

  @Get(':idUser/:idAssociation')
  @ApiOkResponse({ description: 'The role has been successfully retrieved.' })
  getByIds(
    @Param('idUser') idUser: string,
    @Param('idAssociation') idAssociation: string,
  ): Promise<Role> {
    return this.rolesService.getByIds(Number(idUser), Number(idAssociation));
  }

  @Post()
  @ApiCreatedResponse({ description: 'The role has been successfully created.' })
  create(@Body() input: RoleInput): Promise<Role> {
    return this.rolesService.create(input.name, input.idUser, input.idAssociation);
  }

  @Put(':idUser/:idAssociation')
  @ApiOkResponse({ description: 'The role has been successfully updated.' })
  update(
    @Param('idUser') idUser: string,
    @Param('idAssociation') idAssociation: string,
    @Body() input: RoleUpdate,
  ): Promise<Role> {
    return this.rolesService.update(Number(idUser), Number(idAssociation), input.name);
  }

  @Delete(':idUser/:idAssociation')
  @ApiOkResponse({ description: 'The role has been successfully deleted.' })
  remove(
    @Param('idUser') idUser: string,
    @Param('idAssociation') idAssociation: string,
  ): Promise<boolean> {
    return this.rolesService.remove(Number(idUser), Number(idAssociation));
  }
}
