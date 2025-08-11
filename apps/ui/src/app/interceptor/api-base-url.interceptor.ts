import { HttpInterceptorFn } from '@angular/common/http';

import {environment} from '../../environments/environment';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.apiUrl;

  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  const updatedReq = req.clone({
    url: `${baseUrl}${req.url}`
  });

  return next(updatedReq);
};
