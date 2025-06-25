import { ValidationPipe } from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

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

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('API started'))
  .catch(console.error);
