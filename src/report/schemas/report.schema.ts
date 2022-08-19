import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { User } from "../../users/schemas/users.schema";

export type ReportDocument = Report & Document
@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})
export class Report{
    @Prop({
        type: SchemaTypes.ObjectId,
        ref: 'User'
    })
    student: User | string

    @Prop()
    course_code: string

    @Prop({type: String})
    course_title: string

    @Prop({type: String})
    year: string

    @Prop({type: String})
    lecturer: string

    @Prop({type: String})
    comment: string

    // @Prop({})
    // comments: any[]
}

export const ReportSchema = SchemaFactory.createForClass(Report)