import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Association } from './associations/association.entity.js';
import { AssociationsModule } from './associations/associations.module.js';
import { User } from './users/user.entity.js';
import { UsersModule } from './users/users.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'fr-administration',
    }),
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'mydatabase.db',
      entities: [User, Association],
      synchronize: true,
    }),
    UsersModule,
    AssociationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
