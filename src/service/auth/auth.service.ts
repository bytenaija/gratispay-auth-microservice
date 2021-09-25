import { LoggedInUser, PinDto } from './../../models/apiModels/user.dto';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { v4 } from 'uuid';
import {
  CreateGoogleUserDto,
  CreateUserDto,
} from '../../models/apiModels/user.dto';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UserDatabaseService } from '../../database/user.database.service';
import { ClientProxy } from '@nestjs/microservices';
import { Pin } from 'src/models/entities/pin';
import { ObjectId } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @Inject('WALLET_SERVICE') private readonly walletClient: ClientProxy,

    private jwtService: JwtService,
    private readonly databaseService: UserDatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.databaseService.findUserByEmail(email);

    try {
      const match = await this.databaseService.comparePassword(
        password,
        user.passwordHash,
      );
      if (match) {
        const result = {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
        };
        return result;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  async login(user: any): Promise<LoggedInUser> {
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    };
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    };
  }

  async registerUser(createUserDto: CreateUserDto): Promise<LoggedInUser> {
    const user = await this.databaseService.upsert(createUserDto);
    const payload = {
      email: user.email,
      sub: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    };
    await this.walletClient.emit<any>('create_wallet', { userId: user._id });
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
    };
  }

  async googleLogin(
    createGoogleUserDto: CreateGoogleUserDto,
  ): Promise<LoggedInUser> {
    const clientIdAndroid = await this.configService.get(
      'GOOGLE_CLIENT_ID_ANDROID',
    );
    const clientIdIos = await this.configService.get('GOOGLE_CLIENT_ID_IOS');
    const clientIdNest = await this.configService.get(
      'GOOGLE_CLIENT_ID_NESTJS',
    );
    const client = new OAuth2Client(clientIdNest);
    const ticket = await client.verifyIdToken({
      idToken: createGoogleUserDto.idToken,
      audience: [clientIdAndroid, clientIdIos, clientIdNest],
    });
    const googlePayload = ticket.getPayload();

    const user = await this.databaseService.findUserByEmail(
      googlePayload.email,
    );

    if (user) {
      const payload = {
        email: user.email,
        sub: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      };
      return {
        access_token: this.jwtService.sign(payload),
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      };
    } else {
      const newUser: CreateUserDto = {
        email: googlePayload.email,
        firstName: googlePayload.given_name,
        lastName: googlePayload.family_name,
        image: googlePayload.picture,
        password: v4(),
        isPinSet: false,
      };

      return await this.registerUser(newUser);
    }
  }
  async setPin(pinData: PinDto): Promise<Pin> {
    return await this.databaseService.setPin(pinData);
  }
  async getPin(pinData: PinDto): Promise<boolean> {
    const savedPin = await this.databaseService.getPin(pinData.userId);
    console.log(pinData);
    if (this.databaseService.comparePassword(pinData.pin, savedPin.pinHash)) {
      return true;
    } else {
      throw new UnauthorizedException('Invalid Pin');
    }
  }
  async checkPinSet(userId: ObjectId) {
    const savedPin = await this.databaseService.getPin(userId);
    if (savedPin) {
      return { pinSet: true };
    } else {
      return { pinSet: false };
    }
  }
}
