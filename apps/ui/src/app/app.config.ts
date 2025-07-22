import {ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
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
  ]
};
