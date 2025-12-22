
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingSubject = new BehaviorSubject<boolean>(false);
    public loading$ = this.loadingSubject.asObservable();

    private activeRequests = 0;

    constructor(private ngZone: NgZone) { }

    show() {
        this.activeRequests++;
        this.updateLoadingState(true);
    }

    hide() {
        this.activeRequests--;
        if (this.activeRequests <= 0) {
            this.activeRequests = 0;
            this.updateLoadingState(false);
        }
    }

    private updateLoadingState(isLoading: boolean) {
        // Run inside Angular/NgZone to ensure UI updates immediately
        // This fixes the issue where the loader hangs until a user interaction occurs
        this.ngZone.run(() => {
            this.loadingSubject.next(isLoading);
        });
    }
}
