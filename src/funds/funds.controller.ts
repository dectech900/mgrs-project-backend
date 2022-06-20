import { Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { IJWTResponse, IPaginate, IUploadFile } from '../types/types';
import { FundsService } from './funds.service';
import { Funds } from './schemas/funds.schema';

@Controller('funds')
export class FundsController {
    constructor(private readonly fundService: FundsService){}

    @Get()
    async getFunds(
       @Query('isPaginated') isPaginated: string,
       @Query('size') size: number,
       @Query('page') page: number,
        
    ): Promise<IPaginate<Funds> | Funds[]> {
        return await this.fundService.getFunds(isPaginated, size, page)
    }

    @Get('/user')
    @UseGuards(JwtAuthGuard)
    async getUserFund(
        @User() user: IJWTResponse,
        @Query('isPaginated') isPaginated: string,
        @Query('page') page: number,
        @Query('size') size: number
    ):Promise<IPaginate<Funds> | Funds[]>{
        return this.fundService.getUserFund(user, isPaginated, size, page)
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFunds(@UploadedFile() file: IUploadFile): Promise<Funds[]> {
        return await this.fundService.uploadFunds(file)
    }
}
