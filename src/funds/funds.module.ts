import { Module } from '@nestjs/common';
import { FundsService } from './funds.service';
import { FundsController } from './funds.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Funds, FundsSchema } from './schemas/funds.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from '../config/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Funds.name,
        schema: FundsSchema,
      },
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: 'temp/'
      }),
      inject: [ConfigService]
    })
  ],
  providers: [FundsService, Config],
  controllers: [FundsController],
})
export class FundsModule {}
