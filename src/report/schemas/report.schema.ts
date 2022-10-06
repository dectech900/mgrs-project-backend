import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from '../../users/schemas/users.schema';

export type ReportDocument = Report & Document;
@Schema({
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
})
export class Report {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
  })
  student: User | string;

  @Prop()
  course_code: string;

  @Prop({ type: String })
  course_title: string;

  @Prop({ type: String })
  year: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  lecturer: User | string;

  @Prop({ type: String })
  exams_type: string;

  @Prop({ type: String })
  exams_date: string;
  
  @Prop({ type: String })
  exams_venue: string;
  @Prop({ type: String })
  semester: string;

  @Prop({ type: String })
  comment: string;

  @Prop({ type: Boolean, default: false })
  is_read: boolean;

  @Prop({ type: Boolean, default: false })
  is_in_progress: boolean;

  @Prop({ type: Boolean, default: false })
  is_completed: boolean;

  // @Prop({})
  // comments: any[]
}

export const ReportSchema = SchemaFactory.createForClass(Report);
