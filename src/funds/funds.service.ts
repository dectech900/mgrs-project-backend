import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config } from 'src/config/config';
import { Dues } from 'src/dues/schemas/dues.schema';
import { IJWTResponse, IPaginate, IUploadFile } from 'src/types/types';
import { apiPrefix, excelParcer, Paginate } from 'src/utils/helpers';
import { Funds, FundsDocument } from './schemas/funds.schema';

@Injectable()
export class FundsService {
  private readonly logger = new Logger(FundsService.name);
  constructor(
    @InjectModel(Funds.name) private readonly fundsMondel: Model<FundsDocument>,
    private readonly config: Config,
  ) {}

  //get all funds
  async getFunds(
    isPaginated: string,
    size: number,
    page: number,
  ): Promise<IPaginate<Funds> | Funds[]> {
    if (isPaginated && JSON.parse(isPaginated)) {
      const [totalItems, count] = await Promise.all([
        this.fundsMondel.find().exec(),
        this.fundsMondel.countDocuments(),
      ]);

      return Paginate<Funds>(totalItems, count, {
        page: page ?? 1,
        size: size ?? 15,
        url: ``,
      });
    } else {
      return await this.fundsMondel.find().exec();
    }
  }

  async getUserFund(
    user: IJWTResponse,
    isPaginated: string,
    size: number,
    page: number,
  ): Promise<IPaginate<Funds> | Funds[]> {
    if (isPaginated && JSON.parse(isPaginated)) {
      if (user) {
        const [totalItems, count] = await Promise.all([
          await this.fundsMondel
            .find({
              staff_id: user?.staff_id,
            })
            .exec(),
          await this.fundsMondel
            .find({ staff_id: user?.staff_id })
            .countDocuments(),
        ]);
        return Paginate<Funds>(totalItems, count, {
          page: page,
          size: size,
          url: `${this.config.get('server.server_base_url')}${apiPrefix(this.config.get('env'))}/funds`,
        });
      }
    } else {
      return await this.fundsMondel
        .find({
          staff_id: user?.staff_id,
        })
        .exec();
    }
  }

  //upload funds
  async uploadFunds(file: IUploadFile): Promise<any> {
    if (!file && !file.path)
      throw new NotFoundException('No file was selected');
    await this.fundsMondel.deleteMany();
    const funds = [];
    excelParcer(
      file?.path,
      (data) => {
        const obj = {
          staff_id: data['staff_id'],
          original_amount: data['originalamount'],
          balance: data['balbfwrd'],
          deduction: data['monthlyded'],
          period: data['period'],
          transaction_type: data['transactiontype'],
          reference: data['reference'],
        };
        funds.push(obj);
      },
      'sheet 1',
    );

    const uploaded = await this.fundsMondel.create(funds);
    return 'Fund data uploaded successfully';
  }
}
