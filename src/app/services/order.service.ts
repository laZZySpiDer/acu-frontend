import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { OrderDetails } from '../interfaces/order.interface';
import { ApiUrlConstants } from '../constants/url.constants';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderDetailsSubject = new BehaviorSubject<OrderDetails | null>(null);
  orderDetails$ = this.orderDetailsSubject.asObservable();



    constructor(private http: HttpClient) { }

  setOrderDetails(details: OrderDetails) {
    this.orderDetailsSubject.next(details);
  }

  clearOrderDetails() {
    this.orderDetailsSubject.next(null);
  }

  generateOrderId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  getOrderDetails(): OrderDetails | null {
    return this.orderDetailsSubject.getValue();
  }


  getOrderDetailsByTransactionId(transactionId: string): Observable<OrderDetails> {
    // console.log('Fetching order details for transaction ID:', ApiUrlConstants.GET_ORDER_DETAILS,transactionId);
    // const url = ApiUrlConstants.GET_ORDER_DETAILS(transactionId);
    return this.http.get<OrderDetails>(`${ApiUrlConstants.GET_ORDER_DETAILS}/${transactionId}`);
  }
}