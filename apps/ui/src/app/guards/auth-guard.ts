import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import { map } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.tokenSubject.asObservable().pipe(
    map(token => {
      if (token) {
        return true;
      } else {
        return router.createUrlTree(['/auth/login']);
      }
    })
  );

};
