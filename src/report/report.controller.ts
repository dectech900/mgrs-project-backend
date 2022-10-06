import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { IJWTResponse } from 'src/types/types';
import { CreateReportDto, UpdateReportDto } from './dto/report.dto';
import { ReportService } from './report.service';
import { Report } from './schemas/report.schema';

@Controller('report')
export class ReportController {
    constructor(private readonly reportService: ReportService){}

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    async createReport(
        @User() user: IJWTResponse,
        @Body(new ValidationPipe({transform: true})) body: CreateReportDto
    ):Promise<Report>{
        return await this.reportService.createReport(body, user)
    }

    @Delete('/:report_id')
    @UseGuards(JwtAuthGuard)
    async deleteReport(
        @User() user: IJWTResponse,
        @Param('report_id') report_id: string
    ):Promise<Report>{
        return await this.reportService.deleteReport(user, report_id)
    }

    @Put('/:report_id')
    @UseGuards(JwtAuthGuard)
    async updateReport(
        @User() user: IJWTResponse,
        @Param('report_id') report_id: string,
        @Body() updateReportDto: UpdateReportDto
    ):Promise<Report>{
        return await this.reportService.updateReport(user, report_id, updateReportDto)
    }

    @Get('/count-completed')
    @UseGuards(JwtAuthGuard)
    async countCompletedReport(
        @User() user: IJWTResponse,
    ):Promise<Report>{
        return await this.reportService.countCompletedReport(user)
    }

    @Get('/count-progress')
    @UseGuards(JwtAuthGuard)
    async countInProgressReport(
        @User() user: IJWTResponse,
    ):Promise<Report>{
        return await this.reportService.countInProgressReport(user)
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getReport(
        @User() user: IJWTResponse,
    ):Promise<Report[]>{
        return await this.reportService.getReport(user)
    }

    @Get('/lecturer')
    @UseGuards(JwtAuthGuard)
    async getLecturerReport(
        @User() user: IJWTResponse,
    ):Promise<Report[]>{
        return await this.reportService.getLecturerReport(user)
    }
}
