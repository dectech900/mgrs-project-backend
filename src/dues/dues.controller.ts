import { Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { IJWTResponse, IPaginate, IUploadFile } from '../types/types';
import { DuesService } from './dues.service';
import { Dues } from './schemas/dues.schema';

@Controller('dues')
export class DuesController {
    constructor(private readonly duesService: DuesService){}

    @Get()
    async getDues(
        @Query('isPaginated') isPaginated: string,
        @Query('size') size: number,
        @Query('page') page: number
    ): Promise<IPaginate<Dues> | Dues[]> {
        return this.duesService.getDues(isPaginated, size, page)
    }

    @Get('/user')
    @UseGuards(JwtAuthGuard)
    async getUserDues(
        @User() user: IJWTResponse,
        @Query('isPaginated') isPaginated: string,
        @Query('page') page: number,
        @Query('size') size: number
    ):Promise<IPaginate<Dues> | Dues[]>{
        return this.duesService.getUserDues(user, isPaginated, size, page)
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadDues(
        @UploadedFile() file: IUploadFile
    ): Promise<any> {
        return this.duesService.uploadDues(file)
    }
}
