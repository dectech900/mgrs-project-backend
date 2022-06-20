import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Products } from '../../products/schemas/products.schema';
import { User } from '../../users/schemas/users.schema';


export type OrderDocument = Order & Document
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Order {
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
  product_id: string[] | Products[];

  @Prop({
      type: Number,
      default: 1
  })
  quantity: number

  @Prop({
      type: Number,
      required: true
  })
  price: number

  @Prop({
      type: String,
      default: null
  })
  size: string

  @Prop({
      type: String,
      default: null
  })
  color: string

  @Prop({
      type:  Number,
      default: null
  })
  sub_total: number

  @Prop({
      type:  Number,
      default: null
  })
  grand_total: number

  @Prop({
      type:  String,
      default: null
  })
  status: string

  @Prop({
    type: Date,
    default: null,
  })
  deleted_at: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
