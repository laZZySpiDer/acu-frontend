import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TrackingDetails } from '../interfaces/tracking.interface';



@Injectable({
  providedIn: 'root'
})
export class OrderTrackingService {
  private mockOrders: { [key: string]: TrackingDetails } = {
    'ECO-12345': {
      orderId: 'ECO-12345',
      trackingNumber: 'TRK-9876543210',
      estimatedDelivery: '2025-03-15',
      currentStatus: 'shipped',
      statusHistory: [
        {
          status: 'processing',
          timestamp: new Date('2025-03-05T10:30:00'),
          description: 'Order confirmed and payment received'
        },
        {
          status: 'shipped',
          timestamp: new Date('2025-03-07T14:45:00'),
          location: 'Portland, OR',
          description: 'Package has been shipped'
        }
      ],
      items: [
        {
          name: 'Handwoven Basket',
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        },
        {
          name: 'Ceramic Vase',
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1578500351865-0a4734e8cd6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        }
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main St',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
        country: 'US'
      }
    }
  };

  constructor() {}

  trackOrder(orderId: string, email?: string): Observable<TrackingDetails | null> {
    // Simulate API call with delay
    return of(this.mockOrders[orderId] || null).pipe(
      delay(1000)
    );
  }

  // In a real application, this would be connected to a backend API
  getRecentOrders(userId: string): Observable<TrackingDetails[]> {
    return of(Object.values(this.mockOrders)).pipe(
      delay(800)
    );
  }
}