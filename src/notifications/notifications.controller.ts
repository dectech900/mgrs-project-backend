import { Controller, Get, UseGuards } from '@nestjs/common';
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
}
