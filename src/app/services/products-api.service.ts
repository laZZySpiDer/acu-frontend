import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  

  constructor(private http: HttpClient) { }


  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(ApiUrlConstants.GET_PRODUCTS);
  }

  // You can add more methods for specific product requests if needed, e.g.,
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${ApiUrlConstants.GET_PRODUCTS}/${id}`);
  }

  // For example request with query params
  getProductsByCategory(category:string): Observable<any[]> {
    return this.http.get<any[]>(`${ApiUrlConstants.GET_CATEGORIES}?category=${category}`)
  }

}
