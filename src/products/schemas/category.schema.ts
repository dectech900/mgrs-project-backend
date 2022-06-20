import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductCategoryDocument = ProductCategory & Document;
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class ProductCategory {
  @Prop({
    default: null,
  })
  name: string;
  @Prop({
    type: String,
  })
  slug: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({ type: String })
  deleted_at?: string;
}

export const ProductCategorySchema =
  SchemaFactory.createForClass(ProductCategory);
