import { bootstrapApplication } from '@angular/platform-browser';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Sentry from "@sentry/angular";

import { App } from './app/app';
import { appConfig } from './app/app.config';
import {environment} from './environments/environment';

Sentry.init({
  dsn: environment.sentryDsn,
  environment: environment.environment || 'development',
  sendDefaultPii: true,
});

bootstrapApplication(App, appConfig)
  .catch((error) => console.error(error));
