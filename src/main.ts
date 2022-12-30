import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';

import { BasicAuth } from './shared/types/basic-auth.interface';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const version = configService.get<string>('version');
  const basicAuthInfo = configService.get<BasicAuth>('basicAuth');
  const docsPath = '/' + version + '/docs';

  app.setGlobalPrefix(version + '/api');

  // for Custom Validation Class (Injectable)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use(
    docsPath,
    basicAuth({
      challenge: true,
      users: {
        [basicAuthInfo.username]: basicAuthInfo.password,
      },
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Google Search Scraper')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(docsPath, app, document);

  await app.listen(configService.get<number>('port'));
}
bootstrap();
