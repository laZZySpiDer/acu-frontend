import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiUrlConstants } from "../constants/url.constants";
import { UserLoginResponse } from "../interfaces/user.interface";
import { RecaptchaService } from "./recaptcha.service";
import { Observable, firstValueFrom, from, switchMap } from "rxjs";
import { ReCaptchaV3Service } from "ng-recaptcha";

@Injectable({
  providedIn: "root",
})
export class AuthApiService {
  constructor(private http: HttpClient, private recaptchaService: RecaptchaService, private recaptchaV3Service: ReCaptchaV3Service) { }

  login(email: string, password: string) {
    return this.http.post<UserLoginResponse>(`${ApiUrlConstants.LOGIN}`, {
      email,
      password,
    });
  }

  loginWithGoogle(): Observable<any> {
    return this.http.post(ApiUrlConstants.LOGIN_GOOGLE, {}, { withCredentials: true });
  }

  googleLoginWithToken(token: string): Observable<any> {
    return this.http.post(ApiUrlConstants.GOOGLE_LOGIN_WITH_TOKEN, { id_token: token }, { withCredentials: true });
  }

  oauthCallback(access_token: string) {
    return this.http.post<UserLoginResponse>(`${ApiUrlConstants.OAUTH_CALLBACK}`, { access_token });
  }

  logout() {
    return this.http.get<any>(`${ApiUrlConstants.LOGOUT}`);
  }

  register(
    name: string,
    email: string,
    password: string
  ) {
    // const token = await this.recaptcha.getToken("signup");
    // if (!token) throw new Error("Recaptcha failed");

    const role = "customer"; // Default role for registration

    // return await firstValueFrom(this.http.post<UserLoginResponse>(`${ApiUrlConstants.REGISTER}`, { name, email, password, role }));

    return from(this.recaptchaService.getToken("signup")).pipe(
      switchMap((token) => {
        if (!token) throw new Error("Recaptcha failed");
        return this.http.post<UserLoginResponse>(
          `${ApiUrlConstants.REGISTER}`,
          { name, email, password, role, token }
        );
      })
    );
  }
}
