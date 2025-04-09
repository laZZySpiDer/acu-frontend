import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TrackingDetails } from '../../interfaces/tracking.interface';
import { AuthService } from '../../services/auth.service';
import { OrderTrackingService } from '../../services/order-tracking.service';
import { UserLoginResponse } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: UserLoginResponse | null = null;
  orders: TrackingDetails[] = [];
  activeTab: any = 'personal';

  tabs = [
    { id: 'personal', name: 'Personal Details' },
    { id: 'orders', name: 'Orders' },
    { id: 'security', name: 'Security' }
  ];

  profileForm = {
    name: '',
    phone: '',
    address: ''
  };

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private orderTrackingService: OrderTrackingService
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadOrders();
      this.profileForm.name = this.user.name;
    }
  }

  loadOrders() {
    if (this.user) {
      this.orderTrackingService.getRecentOrders(this.user.id)
        .subscribe(orders => {
          this.orders = orders;
        });
    }
  }

  updateProfile() {
    // TODO: Implement profile update
    console.log('Profile update:', this.profileForm);
  }

  updatePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      // Show error
      return;
    }
    // TODO: Implement password update
    console.log('Password update:', this.passwordForm);
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
 }
