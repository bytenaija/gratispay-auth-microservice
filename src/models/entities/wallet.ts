import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type WalletDocument = Wallet & Document;
@Schema()
export class Wallet {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop()
  balance: number;

  @Prop({ required: true, unique: true })
  address: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: mongoose.Schema.Types.ObjectId;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
