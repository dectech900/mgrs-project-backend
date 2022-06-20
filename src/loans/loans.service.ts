import {
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IJWTResponse,
  IPaginate,
  IUploadFile,
  USER_TYPE,
} from 'src/types/types';
import { excelParcer, Paginate } from 'src/utils/helpers';
import { ApplyLoanDto } from './dto/apply-loan.dto';
import { ApplyLoan, ApplyLoanDocument } from './schemas/apply-loan.schema';
import { Loans, LoansDocument } from './schemas/loans.schema';

@Injectable()
export class LoansService {
  private readonly logger = new Logger(LoansService.name);
  constructor(
    @InjectModel(Loans.name) private readonly loansModel: Model<LoansDocument>,
    @InjectModel(ApplyLoan.name)
    private readonly applyLoanModel: Model<ApplyLoanDocument>,
  ) {}

  async getLoans(
    isPaginated: string,
    size: number,
    page: number,
  ): Promise<IPaginate<Loans> | Loans[]> {
    if (isPaginated && JSON.parse(isPaginated)) {
      const [totalItems, count] = await Promise.all([
        await this.loansModel.find().exec(),
        await this.loansModel.countDocuments(),
      ]);
      return Paginate<Loans>(totalItems, count, {
        page: page ? page : 1,
        size: size ?? 15,
        url: ``,
      });
    } else {
      return await this.loansModel.find().exec();
    }
  }

  async getUserLoans(
    user: IJWTResponse,
    isPaginated: string,
    size: number,
    page: number,
  ): Promise<IPaginate<Loans> | Loans[]> {
    if (isPaginated && JSON.parse(isPaginated)) {
      if (user) {
        const [totalItems, count] = await Promise.all([
          await this.loansModel
            .find({
              staff_id: user?.staff_id,
            })
            .exec(),
          await this.loansModel
            .find({ staff_id: user?.staff_id })
            .countDocuments(),
        ]);
        return Paginate<Loans>(totalItems, count, {
          page: page,
          size: size,
          url: ``,
        });
      }
    } else {
      return await this.loansModel
        .find({
          staff_id: user?.staff_id,
        })
        .exec();
    }
  }

  async applyForLoan(user: IJWTResponse, body: ApplyLoanDto): Promise<any> {
    try {
      if (user?.user_type === USER_TYPE.NURSE) {
        return await this.applyLoanModel.create(body);
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }
  async myAppliedLoans(user: IJWTResponse): Promise<any> {
    try {
      if (user?.user_type === USER_TYPE.NURSE) {
        return await this.applyLoanModel.find({staff_id: user?.staff_id})
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  //upload laons
  async uploadLoans(file: IUploadFile): Promise<any> {
    if (!file && !file.path) throw new NotFoundException('file do not exist');
    console.log('file', file);
    const loans = [];
    excelParcer(
      file.path,
      (data) => {
        const ob = {
          staff_id: data['staff_id'],
          original_amount: data['original_amount'],
          balance: data['balance'],
          deduction: data['deduction'],
          period: data['period'],
          transaction_type: data['transaction_type'],
          reference: data['reference'],
        };
        loans.push(ob);
      },
      'sheet 1',
    );
    await this.loansModel.deleteMany();
    const upload = await this.loansModel.create(loans);
    if (upload) {
      return 'Loans data uploaded successfully';
    }
  }
}
