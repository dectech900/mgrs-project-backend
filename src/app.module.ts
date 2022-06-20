import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';
import { ProductsModule } from './products/products.module';
import { FundsModule } from './funds/funds.module';
import { DuesModule } from './dues/dues.module';
import { OrdersModule } from './orders/orders.module';
import { JobsModule } from './jobs/jobs.module';
import { NotificationsModule } from './notifications/notifications.module';


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
    LoansModule,
    ProductsModule,
    FundsModule,
    DuesModule,
    OrdersModule,
    JobsModule,
    NotificationsModule

  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
