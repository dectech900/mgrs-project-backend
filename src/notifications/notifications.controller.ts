import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { IJWTResponse } from '../types/types';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNotification(@User() user: IJWTResponse): Promise<any> {
    return await this.notificationService.getNotification(user);
  }

  @Post('/push/subscribe')
  async pushNotification(
    @Body() pushNotificationDto: any
  ): Promise<any> {
    return await this.notificationService.pushNotification(pushNotificationDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteNotification(
    @Param('id') id: string,
    @User() user: IJWTResponse
  ):Promise<any>{
    return await this.notificationService.deleteNotification(id,user)
  }
}
