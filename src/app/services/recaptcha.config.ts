import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../../environments/environment';

export function provideRecaptcha(): EnvironmentProviders {
  return makeEnvironmentProviders([
        importProvidersFrom(RecaptchaV3Module), 
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptchaSiteKey }
  ]);
}
