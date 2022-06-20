import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { LoansController } from './loans.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Loans, LoansSchema } from './schemas/loans.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplyLoan, ApplyLoanSchema } from './schemas/apply-loan.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Loans.name, schema: LoansSchema },
      { name: ApplyLoan.name, schema: ApplyLoanSchema },
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        dest: 'tmp/',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LoansService],
  controllers: [LoansController],
})
export class LoansModule {}
