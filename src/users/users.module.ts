import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '../config/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { Notifications, NotificationsSchema } from '../notifications/schemas/notifications.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, {name: Notifications.name, schema: NotificationsSchema}]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: 'temp/'
      }),
      inject: [ConfigService]
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILER_HOST'),
          port: configService.get('MAILER_PORT'),
          secure: true,
          auth: {
            user: configService.get('MAILER_USER'),
            pass: configService.get('MAILER_PASS')
          }
        }
      }),
      inject: [ConfigService]
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) =>({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: 'JWT_EXPIRES_IN',
          issuer: 'https://upnmg.com'
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [UsersService, Config],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
