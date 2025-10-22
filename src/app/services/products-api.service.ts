import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/url.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductsApiService {
  

  constructor(private http: HttpClient) { }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(ApiUrlConstants.GET_CATEGORIES);
  }

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

  addToCart(productId: number, quantity: number, product_variant_id: number): Observable<any> {
    return this.http.post<any>(ApiUrlConstants.ADD_TO_CART, { product_id : productId, quantity, product_variant_id });
  }
  removeFromCart(productId: number,product_variant_id: number): Observable<any> {
    return this.http.post<any>(ApiUrlConstants.REMOVE_FROM_CART, { product_id : productId, product_variant_id });
  }
  // updateCart(productId: number, quantity: number): Observable<any> {
  //   return this.http.put<any>(`${ApiUrlConstants.UPDATE_CART}/${productId}`, { quantity });
  // }
  getCart(): Observable<any[]> {
    return this.http.get<any[]>(ApiUrlConstants.GET_CART);
  }

  initiatePayment(orderDetails:any): Observable<any> {
    return this.http.post<any>(ApiUrlConstants.INITIATE_PAYMENT, orderDetails);
  }

  getProductByCategory(categorySlug: string): Observable<any[]> {
    return this.http.get<any[]>(`${ApiUrlConstants.GET_PRODUCT_BY_CATEGORY}${categorySlug}`);
  }

  addProductReview(productId:string,rating:number, comment:string): Observable<any> {
    return this.http.post<any>(`${ApiUrlConstants.ADD_PRODUCT_REVIEW}${productId}/comment`, {rating, comment});
  }
  // clearCart(): Observable<any> {
  //   return this.http.delete<any>(ApiUrlConstants.CLEAR_CART);
  // }

}
