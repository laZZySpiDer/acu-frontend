import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
    forgotForm: FormGroup;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router
    ) {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]]
        });
    }

    onSubmit(): void {
        if (this.forgotForm.invalid) {
            this.forgotForm.markAllAsTouched();
            return;
        }

        this.loading = true;
        const email = this.forgotForm.get('email')?.value;

        this.authService.forgotPassword(email).subscribe({
            next: (res) => {
                this.loading = false;
                // The backend returns { message: "Password reset email sent" }
                // We can use that message or a custom one.
                const msg = res.message || 'Password reset link sent to mail';
                this.notificationService.success(msg);
                this.router.navigate(['/']);
            },
            error: (err) => {
                this.loading = false;
                this.notificationService.error(err.error?.message || 'Failed to send password reset link');
            }
        });
    }
}
