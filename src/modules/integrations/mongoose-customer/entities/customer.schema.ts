import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  region: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  province: string;
}

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true, unique: true })
  accountNumber: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ type: [Address], _id: false })
  address: Address[];

  @Prop({ type: Types.ObjectId, ref: 'BankSampah', required: true })
  bankSampah: Types.ObjectId;

  @Prop({ required: true })
  joinDate: Date;

  @Prop({ required: true, default: 0 })
  balance: number;

  @Prop({ required: true, default: 0 })
  totalDeposit: number;

  @Prop({ required: true, default: 0 })
  totalWithdraw: number;

  @Prop({ required: true, default: 0 })
  totalWeight: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
