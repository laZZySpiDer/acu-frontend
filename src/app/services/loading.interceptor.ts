
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from './loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Skip loader for specific calls if needed (e.g. background polling)
    // For now, we show it for all calls as requested.

    loadingService.show();

    return next(req).pipe(
        finalize(() => {
            loadingService.hide();
        })
    );
};
