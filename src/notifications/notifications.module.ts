import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notifications, NotificationsSchema } from './schemas/notifications.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Notifications.name, schema: NotificationsSchema}])
  ],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsModule]
})
export class NotificationsModule {}
