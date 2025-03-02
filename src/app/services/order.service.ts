import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderDetails } from '../interfaces/order.interface';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orderDetailsSubject = new BehaviorSubject<OrderDetails | null>(null);
  orderDetails$ = this.orderDetailsSubject.asObservable();

  setOrderDetails(details: OrderDetails) {
    this.orderDetailsSubject.next(details);
  }

  clearOrderDetails() {
    this.orderDetailsSubject.next(null);
  }

  generateOrderId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}