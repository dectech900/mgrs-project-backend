import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemas/users.schema';

export type NotificationsDocument = Notifications & Document;
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Notifications {
  @Prop({
    default: null,
  })
  staff_id: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  user_id: string;

  @Prop({
    type: String,
  })
  title?: string;

  @Prop({
    type: String,
  })
  message: string;

  @Prop({})
  deleted_at?: string;
}

export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
