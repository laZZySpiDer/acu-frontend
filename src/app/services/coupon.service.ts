import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUrlConstants } from '../constants/url.constants';

export interface CouponValidationResponse {
    isValid?: boolean;
    valid?: boolean; // Keep for backward compatibility if needed
    message?: string;
    coupon?: {
        code: string;
        discountPercentage: number;
        minCartAmount: number;
    };
    discountAmount?: number;
    newTotal?: number;
}

@Injectable({
    providedIn: 'root'
})
export class CouponService {

    constructor(private http: HttpClient) { }

    validateCoupon(code: string, cartAmount?: number): Observable<CouponValidationResponse> {
        return this.http.post<CouponValidationResponse>(ApiUrlConstants.VALIDATE_COUPON, { code, cartAmount });
    }
}
