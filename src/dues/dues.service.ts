import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJWTResponse, IPaginate, IUploadFile } from 'src/types/types';
import { excelParcer, Paginate } from 'src/utils/helpers';
import { Dues, DuesDocument } from './schemas/dues.schema';

@Injectable()
export class DuesService {
  private readonly logger = new Logger(DuesService.name);
  constructor(
    @InjectModel(Dues.name) private readonly duesModel: Model<DuesDocument>,
  ) {}

  async getDues(
    isPaginated: string,
    size: number,
    page: number,
  ): Promise<IPaginate<Dues> | Dues[]> {
    if (isPaginated && JSON.parse(isPaginated)) {
      const [totalItems, count] = await Promise.all([
        await this.duesModel.find().exec(),
        await this.duesModel.countDocuments(),
      ]);

      return Paginate<Dues>(totalItems, count, {
        page: page ? page : 1,
        size: size ? size : 15,
        url: ``,
      });
    } else {
      return this.duesModel.find().exec();
    }
  }

  async getUserDues(
    user: IJWTResponse,
    isPaginated: string,
    size: number,
    page: number,
  ): Promise<IPaginate<Dues> | Dues[]> {
    if(isPaginated && JSON.parse(isPaginated)){
        if (user) {
            const [totalItems, count] = await Promise.all([
                await this.duesModel
                  .find({
                    staff_id: user?.staff_id,
                  })
                  .exec(),
                  await this.duesModel.find({staff_id: user?.staff_id}).countDocuments()

            ])
            return Paginate<Dues>(totalItems, count, {
                page: page,
                size: size,
                url: ``
            })
          }
    }else{
        return await this.duesModel
        .find({
          staff_id: user?.staff_id,
        })
        .exec()
    }
  }

  async uploadDues(file: IUploadFile): Promise<any> {
    if (!file && !file.path)
      throw new NotFoundException('No file was selected');
    await this.duesModel.deleteMany();
    const dues = [];
    excelParcer(
      file?.path,
      (data) => {
        const obj = {
          staff_id: data['staff_id'],
          original_amount: data['original_amount'],
          balance: data['balance'],
          deduction: data['deduction'],
          period: data['period'],
          transaction_type: data['transaction_type'],
          reference: data['reference'],
        };
        dues.push(obj);
      },
      'sheet 1',
    );

    const uploaded = await this.duesModel.create(dues);
    if (uploaded) return 'Dues uploaded successfully';
  }
}
