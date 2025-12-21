import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TrackingDetails } from '../interfaces/tracking.interface';
import { HttpClient } from '@angular/common/http';
import { ApiUrlConstants } from '../constants/url.constants';



@Injectable({
  providedIn: 'root'
})
export class OrderTrackingService {

  constructor(private http: HttpClient) { }

  trackOrder(orderId: string, email?: string): Observable<TrackingDetails | null> {
    const url = ApiUrlConstants.TRACK_ORDER.replace(':id', orderId);
    return this.http.get<TrackingDetails>(url);
  }

  // In a real application, this would be connected to a backend API
  getRecentOrders(userId: string): Observable<any[]> {
    return this.http.get<any[]>(ApiUrlConstants.GET_ORDERS);

  }

  uploadOrderImages(orderId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('orderId', orderId);
    files.forEach((file) => {
      formData.append('images', file);
    });
    return this.http.post(ApiUrlConstants.UPLOAD_ORDER_IMAGES, formData);
  }
}