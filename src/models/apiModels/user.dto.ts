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
}
