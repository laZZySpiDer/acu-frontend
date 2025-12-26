import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  // private recaptchaV3Service = inject(ReCaptchaV3Service);

  constructor(private recaptchaV3Service: ReCaptchaV3Service, @Inject(PLATFORM_ID) private platformId: Object) { }
  /**
   * Executes Google reCAPTCHA for a given action and returns the token.
   * @param action e.g. 'signup', 'contact', etc.
   */
  async getToken(action: string): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    try {
      const token = await firstValueFrom(this.recaptchaV3Service.execute(action));
      return token;
    } catch (err) {
      console.error('reCAPTCHA failed', err);
      return null;
    }
  }
}
