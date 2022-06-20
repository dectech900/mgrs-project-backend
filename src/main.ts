import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as responseTime from 'response-time';
import * as requestId from 'express-request-id';
import { json, urlencoded } from 'express';
// import {} from '@nestjs/c'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { apiPrefix } from './utils/helpers';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService)
  app.enableCors();
  app.use(helmet());
  app.use(cookieParser());
  app.use(compression());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(responseTime());
  // app.use(requestId())
  app.use('/static/uploads', express.static('uploads'));
  app.set('trust proxy', true);

  app.setGlobalPrefix(apiPrefix('development'));

  const options = new DocumentBuilder()
    .setTitle('UPNMG API DOCUMENTATION')
    .setDescription('Api endpoint for building all applications for upnmg')
    .setContact('Agyapong Derrick', 'https://upnmg.com', 'derrick@upnmg.com')
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api',app,document)


  await app.listen(configService.get('APP_PORT') || 8000);
}
bootstrap();
