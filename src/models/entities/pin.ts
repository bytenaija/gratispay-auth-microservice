import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
export type PinDocument = Pin & Document;
@Schema()
export class Pin {
  _id: ObjectId;

  @Prop()
  pinHash: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: ObjectId;
}

export const PinSchema = SchemaFactory.createForClass(Pin);
