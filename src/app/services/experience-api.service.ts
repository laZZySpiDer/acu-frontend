import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrlConstants } from '../constants/url.constants';
import { Observable } from 'rxjs';

export interface WorkshopInterestPayload {
    name: string;
    phone: string;
    email: string;
    eventType: string;
    message: string;
    estimatedEventDate?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ExperienceApiService {

    constructor(private http: HttpClient) { }

    registerInterest(payload: WorkshopInterestPayload): Observable<any> {
        return this.http.post(ApiUrlConstants.WORKSHOP_INTEREST, payload);
    }
}
