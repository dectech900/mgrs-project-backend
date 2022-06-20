import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LoansDocument = Loans & Document;
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Loans {
  @Prop({
    required: true,
    default: null,
  })
  staff_id: string;

  @Prop({})
  original_amount: string;

  @Prop({
    default: null,
  })
  balance?: string;

  @Prop({})
  deduction: string;

  @Prop({})
  period?: string;

  @Prop({})
  transaction_type?: string;

  @Prop({})
  reference?: string;

  @Prop({})
  deleted_at?: string;
}

export const LoansSchema = SchemaFactory.createForClass(Loans);
