import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserLoginResponse } from '../../interfaces/user.interface';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  error: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  onSubmit() {
    if (!this.email || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (user: any) => {
        console.log(user.user);
        console.log(user.user.token);
        this.authService.setCurrentUser(user);
        this.notificationService.success('Logged in successfully');
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
      }
    });
  }

  loginWithFacebook() {
    this.isLoading = true;
    this.error = '';

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
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      default:
        return 'An error occurred during login';
    }
  }
}
