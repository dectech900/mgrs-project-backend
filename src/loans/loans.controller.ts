import { Body, Controller, Get, Post, Query, UploadedFile, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { Model } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/decorators/user.decorator';
import { IJWTResponse, IPaginate, IUploadFile } from 'src/types/types';
import { Paginate } from 'src/utils/helpers';
import { ApplyLoanDto } from './dto/apply-loan.dto';
import { LoansService } from './loans.service';
import { Loans } from './schemas/loans.schema';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  async getLoans(
   @Query('isPaginated') isPaginated: string,
   @Query('size') size: number,
   @Query('page') page: number,
  ): Promise<IPaginate<Loans> | Loans[]> {
    return await this.loansService.getLoans(isPaginated, size, page);
  }

  @Get('/user')
  @UseGuards(JwtAuthGuard)
  async getUserLoans(
      @User() user: IJWTResponse,
      @Query('isPaginated') isPaginated: string,
      @Query('page') page: number,
      @Query('size') size: number
  ):Promise<IPaginate<Loans> | Loans[]> {
      return await this.loansService.getUserLoans(user, isPaginated, size,page)
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLoans(
      @UploadedFile() file: IUploadFile
  ):Promise<unknown> {
      return await this.loansService.uploadLoans(file)
  }

  @Post('/apply-loan')
  @UseGuards(JwtAuthGuard)
  async applyForLoan(
    @User() user: IJWTResponse,
    @Body(new ValidationPipe({transform: true})) body: ApplyLoanDto
  ):Promise<any> {
    return await this.loansService.applyForLoan(user, body)
  }

  @Get('/my-applied-loans')
  @UseGuards(JwtAuthGuard)
  async myAppliedLoans(
    @User() user: IJWTResponse
  ):Promise<any> {
    const loans = await this.loansService.myAppliedLoans(user)
    console.log('loans', loans)
    return loans
  }

}
