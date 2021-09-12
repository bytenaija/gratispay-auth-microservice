import { UserDatabaseService } from './user.database.service';
import { Injectable, Module } from '@nestjs/common';
import { User, UserSchema } from '../models/entities/user';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserDatabaseService],
  exports: [UserDatabaseService],
})
@Injectable()
export class DatabaseModule {}
