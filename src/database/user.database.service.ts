import { CreateUserDto, PinDto } from '../models/apiModels/user.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../models/entities/user';
import { Pin, PinDocument } from '../models/entities/pin';
import { Model } from 'mongoose';

@Injectable()
export class UserDatabaseService {
  readonly saltRounds = 10;
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Pin.name) private pinModel: Model<PinDocument>,
  ) {}

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

  async setPin(pinDto: PinDto): Promise<Pin> {
    try {
      const pinHash = await bcrypt.hash(pinDto.pin, this.saltRounds);
      const pinData = {
        ...pinDto,
        pinHash,
      };
      const createdPin = new this.pinModel(pinData);
      return createdPin.save();
    } catch (err) {
      throw new InternalServerErrorException('Could not encrypt your password');
    }
  }

  async getPin(userId: ObjectId): Promise<Pin> {
    const pin = this.pinModel.findOne({ userId }).exec();
    if (!pin) {
      throw new BadRequestException('Pin not found');
    }

    return pin;
  }

  async addToken(userId: string, token: string) {
    const user = await this.findById(userId);
    if (user) {
      const tokens = user.tokens || [];
      if (!tokens.includes(token)) {
        tokens.push(token);
      }

      return this.userModel.findByIdAndUpdate(userId, { tokens });
    }
  }
}
