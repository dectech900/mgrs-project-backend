import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJWTResponse } from 'src/types/types';
import { CreateReportDto } from './dto/report.dto';
import { Report, ReportDocument } from './schemas/report.schema';

@Injectable()
export class ReportService {
    constructor(@InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>){}

    async createReport(body: CreateReportDto, user: IJWTResponse):Promise<Report> {
        try {
            return await this.reportModel.create({...body, student: user?.sub})
        } catch (error) {
            console.log('error', error)
        }
    }

    async getReport(user: IJWTResponse):Promise<Report[]> {
        try {
            return await this.reportModel.find({student: user?.sub}).populate('student').exec()
        } catch (error) {
            console.log(error)
        }
    }
}
