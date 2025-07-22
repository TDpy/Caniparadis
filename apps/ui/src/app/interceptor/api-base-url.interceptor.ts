import { HttpInterceptorFn } from '@angular/common/http';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = 'http://localhost:3000';

  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  const updatedReq = req.clone({
    url: `${baseUrl}${req.url}`
  });

  return next(updatedReq);
};
