import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { OrderTrackingService } from '../../services/order-tracking.service';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrackingDetails } from '../../interfaces/tracking.interface';

@Component({
  selector: 'app-track-order',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.css'
})
export class TrackOrderComponent implements OnInit {
  orderId: string = '';
  email: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  trackingDetails: TrackingDetails | null = null;

  constructor(
    private orderTrackingService: OrderTrackingService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.orderId = params['id'];
        this.trackOrder();
      }
    });
  }

  trackOrder() {
    if (!this.orderId) {
      this.errorMessage = 'Please enter an order ID';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.orderTrackingService.trackOrder(this.orderId, this.email)
      .subscribe({
        next: (result: any) => {
          this.isLoading = false;
          if (result) {
            this.trackingDetails = result;
          } else {
            this.errorMessage = 'Order not found. Please check your order ID and try again.';
            this.trackingDetails = null;
          }
        },
        error: (error: Error) => {
          this.isLoading = false;
          this.errorMessage = 'An error occurred while tracking your order. Please try again later.';
          console.error('Error tracking order:', error);
        }
      });
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  formatDateTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
  }
}
