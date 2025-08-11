import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import { map } from 'rxjs';

import {AuthService} from '../services/auth.service';

export const NoAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.tokenSubject.asObservable().pipe(
    map(token => {
      return token ? router.createUrlTree(['/dashboard']) : true;
    })
  );

};
