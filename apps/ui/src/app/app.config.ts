import {provideHttpClient, withInterceptors} from '@angular/common/http';
// eslint-disable-next-line sonarjs/deprecation
import {APP_INITIALIZER, ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideRouter} from '@angular/router';
import { Router } from '@angular/router';
// eslint-disable-next-line @typescript-eslint/naming-convention
import * as Sentry from "@sentry/angular";

import {routes} from './app.routes';
import {apiBaseUrlInterceptor} from './interceptor/api-base-url.interceptor';
import {authInterceptor} from './interceptor/auth.interceptor';
import { bearerTokenInterceptor } from './interceptor/bearer-token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptors([apiBaseUrlInterceptor, bearerTokenInterceptor])),
    provideHttpClient(withInterceptors([apiBaseUrlInterceptor, authInterceptor])),
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      // eslint-disable-next-line sonarjs/deprecation
      provide: APP_INITIALIZER,
      useFactory: () => () => {},
      deps: [Sentry.TraceService],
      multi: true,
    },
  ]
};
