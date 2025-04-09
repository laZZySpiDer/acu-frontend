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

  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  setCurrentUser(user: UserLoginResponse) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser(): UserLoginResponse | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string) {
    return this.authApi.login(email, password);
  }

  logout() {
    this.currentUserSubject.next(null);
  }
}