import { AuthModule } from './auth/auth.module';

import { DatabaseModule } from '../database/database.module';

import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/giveaway'),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
