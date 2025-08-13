import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, switchMap, timer } from 'rxjs';
import { PaymentApiService, PaymentStatusResponse } from '../../services/payment-api.service';

@Component({
  selector: 'app-payment-pending',
  standalone: true,
  imports: [],
  templateUrl: './payment-pending.component.html',
  styleUrl: './payment-pending.component.css'
})
export class PaymentPendingComponent {
  transactionId = '';
  statusMessage = 'Checking payment status...';
  private pollingSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentApi: PaymentApiService,
  ) {}

  ngOnInit(): void {
    // Obtain the transaction id from the route
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.transactionId = id;
      // Start polling immediately and every 5 seconds thereafter
      this.pollingSub = timer(0, 5000)
        .pipe(switchMap(() => this.paymentApi.checkPaymentStatus(this.transactionId)))
        .subscribe({
          next: (status: PaymentStatusResponse) => this.handleStatus(status),
          error: (err) => {
            console.error('Error checking payment status', err);
            this.statusMessage = 'Error checking payment status. Retrying...';
          },
        });
    } else {
      this.statusMessage = 'Invalid transaction id';
    }
  }

  ngOnDestroy(): void {
    // Stop polling when the component is destroyed
    this.pollingSub?.unsubscribe();
  }

  /**
   * Process the returned payment status.  When the payment succeeds or
   * fails the user is redirected accordingly.  Otherwise the message
   * displayed to the user is updated to reflect the pending state.
   */
  private handleStatus(status: PaymentStatusResponse): void {
    switch (status.code) {
      case 'PAYMENT_SUCCESS':
        this.router.navigate(['/order-confirmation', this.transactionId]);
        break;
      case 'PAYMENT_ERROR':
      case 'PAYMENT_FAILED':
        this.router.navigate(['/payment-failed', this.transactionId]);
        break;
      case 'PAYMENT_PENDING':
      default:
        this.statusMessage = status.message || 'Your payment is in a pending state.';
        break;
    }
  }
}
