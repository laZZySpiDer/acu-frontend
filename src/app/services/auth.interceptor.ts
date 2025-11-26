// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('[INTERCEPTOR] Called for:', req.url);

  const authReq = req.clone({
    withCredentials: true,
  });

  return next(authReq);
};
