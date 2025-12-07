import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastNotification } from '../../services/notification.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css'],
    animations: [
        trigger('toastAnimation', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class NotificationComponent implements OnInit {
    notifications: ToastNotification[] = [];

    constructor(private notificationService: NotificationService) { }

    ngOnInit() {
        this.notificationService.notifications$.subscribe(notifications => {
            this.notifications = notifications;
        });
    }

    remove(id: number) {
        this.notificationService.remove(id);
    }
}
