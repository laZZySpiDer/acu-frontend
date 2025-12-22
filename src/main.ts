import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/services/auth.interceptor';
import { loadingInterceptor } from './app/services/loading.interceptor';
import { provideRecaptcha } from './app/services/recaptcha.config';

bootstrapApplication(AppComponent, {
  providers: [
    provideRecaptcha(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      })
    ),
    provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor])),
    provideAnimations()
  ]
}).catch(err => console.error(err));