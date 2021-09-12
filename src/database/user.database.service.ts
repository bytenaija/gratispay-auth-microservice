import { CreateUserDto } from '../models/apiModels/user.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/entities/user';
import { Model } from 'mongoose';

@Injectable()
export class UserDatabaseService {
  readonly saltRounds = 10;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async upsert(createUserDto: CreateUserDto): Promise<User> {
    try {
      const passwordHash = await bcrypt.hash(
        createUserDto.password,
        this.saltRounds,
      );
      const userData = {
        ...createUserDto,
        passwordHash,
      };
      const createdUser = new this.userModel(userData);
      return createdUser.save();
    } catch (err) {
      throw new InternalServerErrorException('Could not encrypt your password');
    }
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async comparePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, passwordHash);

    if (match) {
      return true;
    }

    return false;
  }
}
