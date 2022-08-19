import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { IJWTResponse } from 'src/types/types';
import { CreateReportDto } from './dto/report.dto';
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

    @Get('')
    @UseGuards(JwtAuthGuard)
    async getReport(
        @User() user: IJWTResponse,
    ):Promise<Report[]>{
        return await this.reportService.getReport(user)
    }
}
