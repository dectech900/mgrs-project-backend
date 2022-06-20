import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemas/users.schema';
import { Products } from './products.schema';

export type FavoriteDocument = Favorite & Document
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Favorite {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  })
  user_id: string | User;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Products',
    default: null,
  })
  product_id: string | Products;

  @Prop({
    type: Date,
    default: null,
  })
  deleted_at: string;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
