import { User } from '../../models/entities/user';
import { CreateUserDto } from '../../models/apiModels/user.dto';
import { Injectable } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UserDatabaseService } from '../../database/user.database.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly databaseService: UserDatabaseService,
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
        };
        return result;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerUser(createUserDto: CreateUserDto): Promise<User> {
    return await this.databaseService.upsert(createUserDto);
  }
}
