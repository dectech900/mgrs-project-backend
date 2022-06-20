import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { ProductCategory } from './category.schema';

export type ProductsDocument = Products & Document;
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Products {
  @Prop({
    required: true,
    default: null,
  })
  product_name: string;

  @Prop({})
  slug: string;

  @Prop({
    required: true,
  })
  old_price: number;

  @Prop({
    default: null,
  })
  new_price?: number;

  @Prop({
    default: 1,
    required: true,
  })
  quantity: number;

  @Prop({
    default: 1,
    required: true,
    type: Number
  })
  percent: number;

  @Prop({
    required: true,
  })
  short_description?: string;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: 'ProductCategory',
  })
  category: ProductCategory | string;

  @Prop({})
  description?: string;

  @Prop({
    type: Boolean,
    default: false
  })
  featured?: boolean;

  @Prop({
    default: false,
    type: Boolean
  })
  banner?: boolean;

  @Prop({})
  sizes?: string[];

  @Prop({})
  images: string[];

  @Prop({})
  colors?: string[];

  @Prop({})
  deleted_at?: string;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
