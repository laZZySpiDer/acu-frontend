import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
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
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  user: UserLoginResponse | null = null;
  orders: TrackingDetails[] = [];
  activeTab: any = 'personal';
  selectedFiles: { [orderId: string]: File[] } = {};
  filePreviews: { [orderId: string]: string[] } = {};

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
  ) { }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.loadOrders();
      console.log('User:', this.user);
      this.profileForm.name = this.user.name;
      this.loadProfile();
    }
  }

  loadOrders() {
    if (this.user) {
      this.orderTrackingService.getRecentOrders(this.user.id)
        .subscribe((orders: any) => {
          console.log('ORDERS:', orders.length);
          this.orders = orders.finalOrders;
        });
    }
  }

  loadProfile() {

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

  onFileSelected(event: any, orderId: string) {
    const files: FileList = event.target.files;
    if (files) {
      if (!this.selectedFiles[orderId]) {
        this.selectedFiles[orderId] = [];
        this.filePreviews[orderId] = [];
      }

      const currentCount = this.selectedFiles[orderId].length;
      const remainingSlots = 2 - currentCount;

      if (remainingSlots <= 0) {
        alert('You can only upload a maximum of 2 images per order.');
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        this.selectedFiles[orderId].push(file);

        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreviews[orderId].push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeFile(orderId: string, index: number) {
    this.selectedFiles[orderId].splice(index, 1);
    this.filePreviews[orderId].splice(index, 1);
  }

  uploadImages(orderId: string) {
    if (!this.selectedFiles[orderId] || this.selectedFiles[orderId].length === 0) {
      return;
    }

    this.orderTrackingService.uploadOrderImages(orderId, this.selectedFiles[orderId])
      .subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          this.loadOrders();
          alert('Images uploaded successfully!');
          // Clear selection after successful upload
          this.selectedFiles[orderId] = [];
          this.filePreviews[orderId] = [];
        },
        error: (error) => {
          console.error('Upload failed', error);
          alert('Failed to upload images. Please try again.');
        }
      });
  }

  // Lightbox
  isLightboxOpen = false;
  lightboxImages: string[] = [];
  currentLightboxIndex = 0;

  getDisplayImages(order: TrackingDetails): string[] {
    const images: string[] = [];
    // Add custom images from items
    order.items.forEach(item => {
      if (item.customImageUrl) {
        images.push(item.customImageUrl);
      }
    });
    // Add additional uploaded images
    if (order.additionalImages) {
      images.push(...order.additionalImages);
    }
    return images;
  }

  openLightbox(images: string[], index: number) {
    this.lightboxImages = images;
    this.currentLightboxIndex = index;
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    document.body.style.overflow = '';
    this.lightboxImages = [];
  }

  nextLightboxImage() {
    if (this.lightboxImages.length > 1) {
      this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.lightboxImages.length;
    }
  }

  prevLightboxImage() {
    if (this.lightboxImages.length > 1) {
      this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.lightboxImages.length) % this.lightboxImages.length;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.isLightboxOpen) return;

    if (event.key === 'Escape') {
      this.closeLightbox();
    } else if (event.key === 'ArrowRight') {
      this.nextLightboxImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevLightboxImage();
    }
  }
}
