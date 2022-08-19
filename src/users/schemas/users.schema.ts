import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

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

  })
  staff_id: string;

  @Prop({
    type: String,
  })
  student_id: string;

  @Prop({
    type: String,
  })
  date_of_birth: string;


  @Prop({
    type: String,
    default: null,
  })
  phone_number: string;

  @Prop({
    type: String,
    enum: ['STUDENT', 'LECTURER'],
    default: 'STUDENT',
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
  reset_password_token: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  is_used: boolean;


  @Prop({
    type: Date,
    default: null,
  })
  deleted_at: string;


}

export const UserSchema = SchemaFactory.createForClass(User);
