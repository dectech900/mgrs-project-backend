import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJWTResponse } from 'src/types/types';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { Report, ReportDocument } from './schemas/report.schema';

@Injectable()
export class ReportService {
    constructor(@InjectModel(Report.name) private readonly reportModel: Model<ReportDocument>){}

    async createReport(body: CreateReportDto, user: IJWTResponse):Promise<Report> {
        try {
            return await this.reportModel.create({...body, student: user?.sub, lecturer: body?.lecturer, is_in_progress: true, is_completed: false})
        } catch (error) {
            console.log('error', error)
        }
    }

    async getReport(user: IJWTResponse):Promise<Report[]> {
        try {
            return await this.reportModel.find({student: user?.sub}).populate('student').populate('lecturer').exec()
        } catch (error) {
            console.log(error)
        }
    }

    async countCompletedReport(user: IJWTResponse):Promise<any> {
        try {
            return await this.reportModel.countDocuments({$and: [{is_completed: true}, {student: user?.sub}]})
        } catch (error) {
            console.log(error)
        }
    }
    async countInProgressReport(user: IJWTResponse):Promise<any> {
        try {
            return await this.reportModel.countDocuments({$and: [{is_in_progress: true}, {student: user?.sub}]})
        } catch (error) {
            console.log(error)
        }
    }

    async getLecturerReport(user: IJWTResponse):Promise<Report[]> {
        try {
            return await this.reportModel.find({lecturer: user?.sub}).populate('student').populate('lecturer').exec()
        } catch (error) {
            console.log(error)
        }
    }

    async updateReport(user: IJWTResponse, report_id: string, updateReportDto: UpdateReportDto):Promise<Report> {
        try {
            return await this.reportModel.findOneAndUpdate({_id: report_id}, updateReportDto)
        } catch (error) {
            console.log(error)
        }
    }



    async deleteReport(user:IJWTResponse,report_id: any):Promise<any> {
        try {
            console.log('report_id', report_id)
            return await this.reportModel.deleteOne({_id: report_id}).exec()
        } catch (error) {
            console.log(error)
        }
    }
}
