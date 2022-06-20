import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { UserSchema, User } from 'src/users/schemas/users.schema';
import { JobServiceImpl } from './jobs-service.impl';
import { JobProcessor } from './jobs.processor';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueueAsync({
      name: 'activities',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        name: configService.get('TASK_NAME'),
        redis: {
          host: configService.get('QUEUE_HOST'),
          port: configService.get('QUEUE_PORT') || 6379,
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [JobsService, JobProcessor, JobServiceImpl],
  exports: [JobsService]
})
export class JobsModule {}
