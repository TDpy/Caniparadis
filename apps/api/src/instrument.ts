// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Sentry from '@sentry/nestjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

Sentry.init({
  dsn: process.env.SENTRY_DSN_NEST,
  environment: process.env.NODE_ENV || 'development',
  sendDefaultPii: true,
});
