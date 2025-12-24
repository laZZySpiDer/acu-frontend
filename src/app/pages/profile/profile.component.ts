import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { TrackingDetails } from '../../interfaces/tracking.interface';
import { AuthService } from '../../services/auth.service';
import { OrderTrackingService } from '../../services/order-tracking.service';
import { UserLoginResponse } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
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

  profileForm: FormGroup;

  isProfileLoading: boolean = false;
  isPasswordLoading: boolean = false;

  passwordForm = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  isAvatarModalOpen = false;

  avatarOptions = [
    {
      id: 'mochi',
      name: 'Mochi',
      role: 'Creative Ninja',
      description: 'Creative, playful, always gentle'
    },
    {
      id: 'adi',
      name: 'Adi',
      role: 'The grounded one',
      description: 'Observes, reflects, and keeps things balanced.'
    },
    {
      id: 'ahiru',
      name: 'Ahiru',
      role: 'The Creator',
      description: 'Finds stories in little moments'
    }
  ];

  constructor(
    private authService: AuthService,
    private orderTrackingService: OrderTrackingService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^(\+91[\-\s]?)?[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.maxLength(1000)]],
      pincode: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]{5}$/)]],
      landmark: ['', Validators.maxLength(100)],
      city: ['', Validators.maxLength(100)],
      state: ['', Validators.maxLength(100)],
      profile_avatar: ['mochi']
    });
  }

  ngOnInit() {
    this.authService.checkAuthStatus().subscribe(user => {
      this.user = user;
      if (this.user) {
        this.loadOrders();
        console.log('User:', this.user);
        this.profileForm.patchValue({
          name: this.user.name,
          phone: (this.user as any).phone_number || this.user.phone || '',
          address: this.user.address || '',
          pincode: this.user.pincode || '',
          landmark: this.user.landmark || '',
          city: this.user.city || '',
          state: this.user.state || '',
          profile_avatar: this.user.profile_avatar || 'mochi'
        });
      }
    });
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
    if (this.profileForm.invalid) {
      this.notificationService.error('Please fill all required fields correctly');
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isProfileLoading = true;
    const { name, phone, address, pincode, landmark, city, state, profile_avatar } = this.profileForm.value;

    this.authService.updateProfile(
      name,
      phone,
      address,
      pincode,
      landmark,
      city,
      state,
      profile_avatar
    ).subscribe({
      next: (updatedUser: any) => {
        console.log('Profile updated', updatedUser);
        this.isProfileLoading = false;
        // Success notification handled in AuthService
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        this.isProfileLoading = false;
        this.notificationService.error('Failed to update profile. Please try again.');
      }
    });
  }

  isEmailProvider(): boolean {
    if (!this.user) return false;
    // Check main provider or providers array
    if (this.user.provider === 'email') return true;
    if (this.user.providers && this.user.providers.includes('email')) return true;
    // Fallback logic if needed, but per request: only show if provider is email
    return false;
  }

  updatePassword() {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.notificationService.error('Passwords do not match');
      return;
    }

    if (!this.passwordForm.newPassword) {
      this.notificationService.error('New password is required');
      return;
    }

    this.isPasswordLoading = true;
    // Calling the new changePassword API which only takes newPassword
    this.authService.changePassword(
      this.passwordForm.newPassword
    ).subscribe({
      next: () => {
        console.log('Password updated');
        this.isPasswordLoading = false;
        this.passwordForm = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        // Logout and redirect (Clear local state without calling backend logout API)
        this.authService.setCurrentUser(null);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Failed to change password', err);
        this.isPasswordLoading = false;
        this.notificationService.error(err.error?.message || 'Failed to change password. Please try again.');
      }
    });
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

  // Avatar Modal Logic
  openAvatarModal() {
    this.isAvatarModalOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeAvatarModal() {
    this.isAvatarModalOpen = false;
    document.body.style.overflow = '';
  }

  selectAvatar(avatarId: string) {
    this.profileForm.patchValue({ profile_avatar: avatarId });
    this.closeAvatarModal();
    // Optional: Auto-save or just let user click "Save Changes"
    // For now we just update the form value, user still has to click "Save Changes" on the main form.
    // If immediate feedback is desired we can call updateProfile() here, but the user request implied "change the profile photo", usually implies selection. 
    // Given the form context, "Save Changes" button exists. However, usually avatar changes are instant or part of the form. 
    // Since it's binding to the form control which is submitted with the form, we'll keep it as form selection.
  }

  // Validation methods removed in favor of Reactive Forms validators

  validatePasswordsMatch() {
    if (this.passwordForm.confirmPassword && this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.notificationService.error('Passwords do not match');
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
