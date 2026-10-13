import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { AssociationsController } from './associations.controller.js';
import { AssociationsService } from './associations.service.js';

@Module({
  imports: [UsersModule],
  controllers: [AssociationsController],
  providers: [AssociationsService],
})
export class AssociationsModule {}
