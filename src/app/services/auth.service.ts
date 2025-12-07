import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, of, tap } from 'rxjs';
import { ApiUrlConstants } from '../constants/url.constants';
import { AuthApiService } from './auth-api.service';
import { UserLoginResponse } from '../interfaces/user.interface';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserLoginResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private authApi: AuthApiService, private http: HttpClient) {
    this.checkAuthStatus().subscribe();
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  setCurrentUser(data: any) {
    if (!data) {
      this.currentUserSubject.next(null);
      return;
    }

    // Check if data has a 'user' property (Login response structure)
    if (data.user) {
      this.currentUserSubject.next(data.user);
    } else {
      // Otherwise assume data itself is the user object (e.g. /me response)
      this.currentUserSubject.next(data);
    }
  }

  getCurrentUser(): UserLoginResponse | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.authApi.login(email, password).pipe(
      tap((response) => this.setCurrentUser(response))
    );
  }

  loginWithGoogle() {
    return this.authApi.loginWithGoogle().pipe(
      tap((response) => this.setCurrentUser(response))
    );
  }

  googleLoginWithToken(token: string) {
    return this.authApi.googleLoginWithToken(token).pipe(
      tap((response: UserLoginResponse) => {
        this.setCurrentUser(response);
      })
    );
  }

  handleOAuthCallback(token: string) {
    return this.authApi.oauthCallback(token).pipe(
      tap((response) => this.setCurrentUser(response))
    );
  }

  logout() {
    return this.authApi.logout().pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  checkAuthStatus() {
    return this.http.get<UserLoginResponse>(ApiUrlConstants.ME).pipe(
      tap(userResponse => {
        console.log("ME", userResponse);
        this.setCurrentUser(userResponse);
      }),
      catchError(error => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }
}