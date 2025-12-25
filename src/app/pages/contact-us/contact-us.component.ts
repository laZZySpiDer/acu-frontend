import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ApiUrlConstants } from '../../constants/url.constants';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-contact-us',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './contact-us.component.html',
})
export class ContactUsComponent {
    contactForm: FormGroup;
    isLoading = false;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.contactForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
            phoneNumber: ['', [Validators.required, Validators.pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)]],
            message: ['', [Validators.required, Validators.minLength(10)]]
        });
    }

    onSubmit() {
        if (this.contactForm.valid) {
            this.isLoading = true;
            const payload = this.contactForm.value;

            this.http.post(ApiUrlConstants.CONTACT_US, payload).subscribe({
                next: (res: any) => {
                    this.isLoading = false;
                    // As per request: successfully of the api it will send this response : res.status(200).json({ message: 'Contact request sent successfully' });
                    // We can use the message from response or hardcode it as requested imply logic.
                    this.notificationService.success(res.message || 'Contact request sent successfully');
                    this.contactForm.reset();
                },
                error: (err) => {
                    this.isLoading = false;
                    console.error('Contact error:', err);
                    this.notificationService.error(err.error?.message || 'Failed to send message. Please try again.');
                }
            });
        } else {
            this.contactForm.markAllAsTouched();
        }
    }

    // Helper getters for template
    get name() { return this.contactForm.get('name'); }
    get email() { return this.contactForm.get('email'); }
    get phoneNumber() { return this.contactForm.get('phoneNumber'); }
    get message() { return this.contactForm.get('message'); }
}
