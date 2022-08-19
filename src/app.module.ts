import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './auth/guards/roles.guard';
import { CourseModule } from './course/course.module';
import { ReportModule } from './report/report.module';



@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI")
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    NotificationsModule,
    CourseModule,
    ReportModule,

  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, {
    provide: APP_GUARD,
    useClass: RoleGuard
  }],
})
export class AppModule {}
