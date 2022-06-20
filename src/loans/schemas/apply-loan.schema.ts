import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ApplyLoanDocument = ApplyLoan & Document;
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class ApplyLoan {
  @Prop({})
  IDCardNumber: string;
  @Prop({
    type: String,
  })
  IdCardType: string;
  @Prop({
    type: String,
  })
  RefGhanaNationIdentificationNo: string;
  @Prop({
    type: String,
  })
  RefLastName: string;
  @Prop({
    type: Number,
  })
  affordability: number;
  @Prop({
    type: Number,
  })
  age: number;
  @Prop({
    type: String,
  })
  bank_account_holder_name: string;
  @Prop({
    type: String,
  })
  bank_account_number: string;
  @Prop({
    type: String,
  })
  bank_branch: string;
  @Prop({
    type: String,
  })
  bank_name: string;
  @Prop({
    type: String,
  })
  dateOfBirth: string;
  @Prop({
    type: String,
  })
  email: string;
  @Prop({
    type: String,
  })
  employer_name: string;
  @Prop({
    type: String,
  })
  employment_start_date: string;
  @Prop({
    type: String,
  })
  facility: string;
  @Prop({
    type: String,
  })
  firstName: string;
  @Prop({
    type: String,
  })
  instalmentPerMonth: string;
  @Prop({
    type: String,
  })
  interestPerMonth: string;
  @Prop({
    type: String,
  })
  lastName: string;
  @Prop({
    type: String,
  })
  loanAmount: string;
  @Prop({
    type: String,
  })
  loanTerm: string;
  @Prop({
    type: String,
  })
  loantotalCollectable: string;
  @Prop({
    type: String,
  })
  middleName: string;
  @Prop({
    type: String,
  })
  modeOfPayment: string;
  @Prop({
    type: String,
  })
  netSalary: string;
  @Prop({
    type: String,
  })
  personal_phone: string;
  @Prop({
    type: String,
  })
  purposeForLoan: string;
  @Prop({
    type: String,
  })
  refContact1: string;
  @Prop({
    type: String,
  })
  refContact2: string;
  @Prop({
    type: String,
  })
  refMiddleName: string;
  @Prop({
    type: String,
  })
  refSurname: string;
  @Prop({
    type: String,
  })
  residential_address1: string;
  @Prop({
    type: String,
  })
  residential_address2: string;
  @Prop({
    type: String,
  })
  ssnit: string;
  @Prop({
    type: String,
  })
  staff_id: string;
  @Prop({
    type: String,
  })
  work_address1: string;
  @Prop({
    type: String,
  })
  work_address2: string;
  @Prop({
    type: String,
  })
  work_phone: string;

  @Prop({
    type: Boolean,
  })
  submitted: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  booked: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  initiated: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  paid: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  rejected: boolean;

}

export const ApplyLoanSchema = SchemaFactory.createForClass(ApplyLoan);
