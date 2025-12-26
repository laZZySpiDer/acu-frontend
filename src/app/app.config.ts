import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';
import { authInterceptor } from './services/auth.interceptor';
import { loadingInterceptor } from './services/loading.interceptor';
import { provideRecaptcha } from './services/recaptcha.config';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRecaptcha(),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'top',
            })
        ),
        provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor]), withFetch()),
        provideAnimations(),
        provideClientHydration()
    ]
};
