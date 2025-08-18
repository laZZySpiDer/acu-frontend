import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlConstants } from '../constants/url.constants';
import { UserLoginResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<UserLoginResponse>(`${ApiUrlConstants.LOGIN}`, { email, password });
  }

  logout() {
    return this.http.get<any>(`${ApiUrlConstants.LOGOUT}`);
  }

  register(name: string, email: string, password: string) {
    const role = 'customer'; // Default role for registration
    return this.http.post<UserLoginResponse>(`${ApiUrlConstants.REGISTER}`, { name, email, password, role });
  }
}
