import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../services/auth-api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private authApiService: AuthApiService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  onSubmit() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'Password must be at least 8 characters long';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authApiService.register(this.name, this.email, this.password).subscribe({
      next: () => {
        this.notificationService.success('Registration successful! PLease login');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = this.getErrorMessage(err.code);
        this.notificationService.error(this.error);
      }
    });
  }

  loginWithGoogle() {
    this.isLoading = true;
    this.error = '';

    this.authService.loginWithGoogle().subscribe({
      next: (user: any) => {
        console.log('Google Login Success', user);
        window.location.href = user.url;
        // this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Google Login Error', err);
        this.isLoading = false;
        this.error = 'Failed to login with Google';
        this.notificationService.error(this.error);
      }
    });
  }

  loginWithFacebook() {
    // this.isLoading = true;
    // this.error = '';

    // this.authService.loginWithFacebook().subscribe({
    //   next: () => {
    //     this.router.navigate(['/']);
    //   },
    //   error: (err) => {
    //     this.isLoading = false;
    //     this.error = this.getErrorMessage(err.code);
    //   }
    // });
  }

  private getErrorMessage(code: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/weak-password':
        return 'Password is too weak';
      default:
        return 'An error occurred during registration';
    }
  }
}
