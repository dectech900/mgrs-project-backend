import { Module } from '@nestjs/common';
import { DuesService } from './dues.service';
import { DuesController } from './dues.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Dues, DuesSchema } from './schemas/dues.schema';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        dest: 'tmp/',
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Dues.name, schema: DuesSchema }]),
  ],
  providers: [DuesService],
  controllers: [DuesController],
})
export class DuesModule {}
