import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Products } from '../../products/schemas/products.schema';

export type UserDocument = User & Document;
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class User {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  staff_id: string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Productss',
    default: null
  })
  products: Products

  @Prop({
    type: String,
    default: null,
  })
  phone_number: string;

  @Prop({
    type: String,
    enum: ['NURSE', 'ADMIN'],
    default: null,
  })
  user_type: string;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: String,
    default: null,
  })
  profile_image: string;

  @Prop({
    type: String,
    default: null,
  })
  cover_image: string;

  @Prop({
    type: String,
    default: null,
  })
  facility?: string;
  @Prop({
    type: String,
    default: null,
  })
  department?: string;
 

  @Prop({
    type: String,
    default: null,
  })
  region: string;

  @Prop({
    type: String,
    default: null,
  })
  district: string;

  @Prop({
    type: String,
    default: null,
  })
  reference: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  is_account_active: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  accept_privacy_policy: boolean;

  @Prop({
    type: String,
    default: null,
  })
  reset_password_token: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_used: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  changed_password: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  allow_2step_verification: boolean;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_email_verified: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  deleted_at: string;

  @Prop({
    type: Date,
    default: null,
  })
  lastLoggedIn: string;

  @Prop({
    type: Number,
    default: 0,
  })
  verification_retries?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
