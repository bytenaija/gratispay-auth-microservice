import * as mongoose from 'mongoose';
import {
  ApiPropertyName,
  ApiPropertyPrimaryKey,
} from '../../decorators/api.decorators';
import { UserModel } from '../model/user';

export class UserDto implements UserModel {
  @ApiPropertyPrimaryKey
  _id: mongoose.Schema.Types.ObjectId;
  @ApiPropertyName('firstName')
  firstName: string;
  @ApiPropertyName('lastname')
  lastName: string;
  @ApiPropertyName('password')
  password: string;
  @ApiPropertyName('email')
  email: string;
  @ApiPropertyName('image')
  image: string;
  @ApiPropertyName('')
  isPinSet: boolean;
}

export class CreateUserDto implements UserModel {
  @ApiPropertyName('firstName')
  firstName: string;
  @ApiPropertyName('lastname')
  lastName: string;
  @ApiPropertyName('password')
  password: string;
  @ApiPropertyName('email')
  email: string;
  @ApiPropertyName('image')
  image: string;
  @ApiPropertyName('')
  isPinSet: boolean;
}

export class CreateGoogleUserDto {
  @ApiPropertyName('idToken')
  idToken: string;
  @ApiPropertyName('firstName')
  user: User;
}
export class PinDto {
  @ApiPropertyName('pin')
  pin: string;
  @ApiPropertyName('userId')
  userId: mongoose.Schema.Types.ObjectId;
}

export type User = {
  email: string;
  familyName: string;
  givenName: string;
  id: string;
  name: string;
  photoUrl: string;
};

export class LoggedInUser {
  @ApiPropertyName('token')
  access_token: string;
  @ApiPropertyName('email')
  email: string;
  @ApiPropertyName('sub')
  id: mongoose.Schema.Types.ObjectId;
  @ApiPropertyName('firstName')
  firstName: string;
  @ApiPropertyName('lastName')
  lastName: string;
  @ApiPropertyName('image')
  image: string;
}
