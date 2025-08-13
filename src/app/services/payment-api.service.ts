import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/url.constants';

/**
 * Represents the structure returned from the backend when querying the
 * status of a payment.  It mirrors the response from the PhonePe
 * gateway but is shaped to support strong typing on the frontend.
 */
export interface PaymentStatusResponse {
  success: boolean;
  code: string;
  message: string;
  data: {
    merchantId: string;
    merchantTransactionId: string;
    transactionId: string;
    amount: number;
    state: 'PENDING' | 'SUCCESS' | 'FAILED';
    responseCode: string | null;
  };
}

@Injectable({ providedIn: 'root' })
export class PaymentApiService {
  constructor(private http: HttpClient) {}

  /**
   * Poll the backend for the status of the given transaction.  The
   * endpoint returns the current state of the payment and should be
   * polled until the code changes to PAYMENT_SUCCESS.  The base URL
   * should be configured via your environment file (e.g. environment.ts).
   */
  checkPaymentStatus(transactionId: string): Observable<PaymentStatusResponse> {
    // Construct the endpoint.  Replace `environment.apiBaseUrl` with
    // your actual API base URL if different.  This service assumes that
    // the backend exposes GET /payment/status/:id as implemented in
    // PaymentController.
    const url = `${ApiUrlConstants.CHECK_PAYMENT_STATUS}/${transactionId}`;
    return this.http.get<PaymentStatusResponse>(url);
  }
}