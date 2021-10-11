import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
export type UserDocument = User & Document;
@Schema()
export class User {
  _id: ObjectId;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop({
    required: false,
    default: 'https://шпаковскаярб.рф/images/no_photo.png',
  })
  image: string;

  @Prop()
  passwordHash: string;

  @Prop({
    required: true,
    default: false,
  })
  isPinSet: boolean;

  @Prop()
  tokens: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
