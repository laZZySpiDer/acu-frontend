import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { ApiUrlConstants } from '../constants/url.constants';
import { AuthApiService } from './auth-api.service';
import { UserLoginResponse } from '../interfaces/user.interface';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from './notification.service';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserLoginResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private authApi: AuthApiService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService
  ) {
    this.checkAuthStatus().subscribe();
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  setCurrentUser(data: any) {
    if (isPlatformBrowser(this.platformId)) {
      if (!data) {
        localStorage.removeItem('isLoggedIn');
      } else {
        localStorage.setItem('isLoggedIn', 'true');
      }
    }

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

  updateProfile(name: string, phone: string, address: string, pincode: string, landmark: string, city: string, state: string, profile_avatar: string) {
    return this.authApi.updateProfile(name, phone, address, pincode, landmark, city, state, profile_avatar).pipe(
      tap((user: any) => {
        this.setCurrentUser(user);
        this.notificationService.success('Profile updated successfully');
      })
    );
  }

  updatePassword(password: string, newPassword: string) {
    return this.authApi.updatePassword(password, newPassword).pipe(
      tap(() => {
        this.notificationService.success('Password updated successfully');
      })
    );
  }

  resetPassword(token: string, email: string, newPassword: string) {
    return this.authApi.resetPassword(token, email, newPassword).pipe(
      tap(() => {
        this.notificationService.success('Password updated successfully');
      })
    );
  }

  forgotPassword(email: string) {
    return this.authApi.forgotPassword(email);
  }

  changePassword(newPassword: string) {
    return this.authApi.changePassword(newPassword).pipe(
      tap(() => {
        this.notificationService.success('Password changed successfully');
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
      tap(() => this.setCurrentUser(null))
    );
  }

  checkAuthStatus() {
    if (isPlatformBrowser(this.platformId)) {
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      if (!isLoggedIn) {
        return of(null);
      }
    }
    return this.http.get<UserLoginResponse>(ApiUrlConstants.ME).pipe(
      tap(userResponse => {
        console.log("ME", userResponse);
        this.setCurrentUser(userResponse);
      }),
      catchError(error => {
        this.setCurrentUser(null);
        return of(null);
      })
    );
  }
}