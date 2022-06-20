import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IJWTResponse } from 'src/types/types';
import { CreateOrderDto } from './dto/order.dto';
import { Order, OrderDocument } from './schemas/order-schema';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async createUserOder(user: IJWTResponse, body: CreateOrderDto): Promise<Order> {
    try {
      if (user) {
          console.log('user', user)
        //   return
          return await this.orderModel.create({
              user_id: user?.sub,
              ...body
          })
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

  async getUserOder(user: IJWTResponse): Promise<Order[]> {
    try {
      if (user) {
          return await this.orderModel.find({user_id: user?.sub}).populate({
              path: 'product_id'
          }).exec()
      }
    } catch (e) {
      this.logger.error(e?.message, e?.stack);
      throw new HttpException(e?.message, e?.status);
    }
  }

}
