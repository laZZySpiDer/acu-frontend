import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiUrlConstants } from '../constants/url.constants';
import { AuthApiService } from './auth-api.service';
import { UserLoginResponse } from '../interfaces/user.interface';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserLoginResponse | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private authApi: AuthApiService) {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const user: UserLoginResponse = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
    }
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  setCurrentUser(user: any) {
    if(!user || !user.user) {
      this.currentUserSubject.next(null);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('currentUser');
      return;
    }
    this.currentUserSubject.next(user.user);
    sessionStorage.setItem('token', user.user.token);
    sessionStorage.setItem('currentUser', JSON.stringify(user.user));
  }

  getCurrentUser(): UserLoginResponse | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.authApi.login(email, password);
  }

  logout() {
    this.currentUserSubject.next(null);
    return this.authApi.logout();
  }
}