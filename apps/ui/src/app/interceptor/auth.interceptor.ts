import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, throwError} from 'rxjs';

import {AuthService} from '../services/auth.service';
import {ToasterService} from '../services/toaster.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const toasterService = inject(ToasterService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 && !req.url.includes('/auth/logout') && !req.url.includes('/auth/login')) {
        authService.logout(false);
        toasterService.error('Session expirée. Veuillez vous reconnecter.');
      }
      return throwError(() => err);
    })
  );
};
