import './instrument';

import { ValidationPipe } from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import {AppModule} from './app.module';
import {AllExceptionsFilter} from './filter/restExceptionFIlter';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );


  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Caniparadis - API')
    .setDescription('Documentation technique de l\'API Caniparadis')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('API started'))
  .catch(console.error);
