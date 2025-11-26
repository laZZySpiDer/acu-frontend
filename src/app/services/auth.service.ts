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

  setCurrentUser(user: any) {
    if(!user || !user.user) {
      this.currentUserSubject.next(null);
      return;
    }
    this.currentUserSubject.next(user.user);
  }

  getCurrentUser(): UserLoginResponse | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.authApi.login(email, password).pipe(
      tap(() => this.checkAuthStatus().subscribe())
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
        this.setCurrentUser(userResponse);
      }),
      catchError(error => {
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }
}