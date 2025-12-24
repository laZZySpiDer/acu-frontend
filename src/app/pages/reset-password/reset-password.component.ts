import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    resetForm: FormGroup;
    targetToken: string | null = null;
    emailFromUrl: string | null = null;
    loading = false;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthService,
        private notificationService: NotificationService
    ) {
        this.resetForm = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    ngOnInit(): void {
        // Read URL params (token, email)
        this.route.queryParams.subscribe(params => {
            this.targetToken = params['token'];
            this.emailFromUrl = params['email'];

            if (!this.targetToken || !this.emailFromUrl) {
                // Optional: Show error immediately if params are missing
                // this.notificationService.error('Invalid password reset link.');
                // this.router.navigate(['/']);
            }
        });
    }

    passwordMatchValidator(g: FormGroup) {
        return g.get('password')?.value === g.get('confirmPassword')?.value
            ? null : { mismatch: true };
    }

    onSubmit(): void {
        if (this.resetForm.invalid) {
            this.resetForm.markAllAsTouched();
            return;
        }

        if (!this.targetToken || !this.emailFromUrl) {
            this.notificationService.error('Invalid link: missing token or email.');
            return;
        }

        this.loading = true;
        const newPassword = this.resetForm.get('password')?.value;

        this.authService.resetPassword(this.targetToken, this.emailFromUrl, newPassword).subscribe({
            next: (res: any) => {
                this.loading = false;
                // message validation is optional since service handles it, but we can double check
                this.router.navigate(['/login']);
            },
            error: (err) => {
                this.loading = false;
                this.notificationService.error(err.error?.message || 'Failed to reset password');
            }
        });
    }
}
