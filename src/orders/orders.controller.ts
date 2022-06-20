import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { User } from '../decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IJWTResponse } from '../types/types';
import { CreateOrderDto } from './dto/order.dto';
import { OrdersService } from './orders.service';
import { Order } from './schemas/order-schema';

@Controller('orders')
export class OrdersController {
    constructor(private readonly orderService: OrdersService){}

    @Post('/user/add')
    @UseGuards(JwtAuthGuard)
    async createUserOder(
        @Body(new ValidationPipe({transform: true})) body: CreateOrderDto,
        @User() user: IJWTResponse
        ):Promise<Order> {
        return await this.orderService.createUserOder(user,body)
    }

    @Get('/user')
    @UseGuards(JwtAuthGuard)
    async getUserOder(
        @User() user: IJWTResponse
        ):Promise<Order[]> {
        return await this.orderService.getUserOder(user)
    }


}
