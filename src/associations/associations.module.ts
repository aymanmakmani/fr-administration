import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module.js';
import { Association } from './association.entity.js';
import { AssociationsController } from './associations.controller.js';
import { AssociationsService } from './associations.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Association]), UsersModule],
  controllers: [AssociationsController],
  providers: [AssociationsService],
})
export class AssociationsModule {}
