import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authHeader = 'Basic ' + btoa('admin:admin123');

  const authReq = req.clone({
    setHeaders: {
      Authorization: authHeader,
    },
  });

  return next(authReq);
};
