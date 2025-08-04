import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Role } from '@caniparadis/dtos/dist/userDto';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

export const AdminGuard  = () : Observable<UrlTree  | boolean>  => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    map(user => {
      return user.role === Role.ADMIN
        ? true
        : router.createUrlTree(['/dashboard']);
    })
  );
};
