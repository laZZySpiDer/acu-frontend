import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastNotification {
    id: number;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationsSubject = new BehaviorSubject<ToastNotification[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();
    private counter = 0;

    constructor() { }

    show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000) {
        const id = this.counter++;
        const notification: ToastNotification = { id, type, message, duration };

        const currentNotifications = this.notificationsSubject.getValue();
        this.notificationsSubject.next([...currentNotifications, notification]);

        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }

    remove(id: number) {
        const currentNotifications = this.notificationsSubject.getValue();
        this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
    }

    success(message: string, duration?: number) {
        this.show(message, 'success', duration);
    }

    error(message: string, duration?: number) {
        this.show(message, 'error', duration);
    }

    info(message: string, duration?: number) {
        this.show(message, 'info', duration);
    }

    warning(message: string, duration?: number) {
        this.show(message, 'warning', duration);
    }
}
