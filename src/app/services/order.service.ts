import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OrderDetails {
  orderId: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingMethod: string;
  estimatedDelivery: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
    color?: string;
    size?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

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