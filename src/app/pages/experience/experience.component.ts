import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Workshop, InviteType } from '../../interfaces/experience.interface';
import { AuthService } from '../../services/auth.service';
import { ExperienceApiService } from '../../services/experience-api.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent {
  workshops: Workshop[] = [
    {
      id: 'doll-painting',
      title: 'Doll Painting Workshop',
      description: 'Paint and personalize your own wooden doll in this mindful, beginner-friendly art workshop by Ahiru’s Creative Universe.',
      image: 'assets/images/workshops/doll-painting.webp',
      duration: '2-3 hours',
      price: 2500
    },
    {
      id: 'clay-magnets',
      title: 'Clay Magnets Workshop',
      description: 'Create cute, functional clay magnets from scratch in a playful, hands-on workshop designed for creative joy.',
      image: 'assets/images/workshops/clay-magnet.webp',
      duration: '2-3 hours',
      price: 2000
    },
    {
      id: 'doodling',
      title: 'Doodling Workshop',
      description: 'Unwind and express yourself through guided doodling techniques focused on mindfulness and creative freedom.',
      image: 'assets/images/workshops/doodling.webp',
      duration: '2-3 hours',
      price: 1800
    },
    {
      id: 'canvas',
      title: 'Canvas Workshop',
      description: 'Explore colors and brush techniques while creating your own canvas artwork in a relaxed, guided painting session.',
      image: 'assets/images/workshops/canvas.webp',
      duration: '2-3 hours',
      price: 1500
    }
  ];

  inviteTypes: InviteType[] = [
    {
      id: 'wedding',
      title: 'Wedding Invitations',
      description: 'Elegant digital wedding invitations crafted with custom illustrations and thoughtful details - designed to tell your love story beautifully.',
      image: 'assets/images/invites/1.webp',
      startingPrice: 3999
    },
    {
      id: 'baby-shower',
      title: 'Baby Shower Invitations',
      description: 'Playful, heart-warming digital invites for baby showers and birthdays- illustrated to celebrate little moments with big love.',
      image: 'assets/images/invites/2.webp',
      startingPrice: 2999
    },
    {
      id: 'custom',
      title: 'Custom Invitations',
      description: 'Custom digital invitations for every celebration - thoughtfully illustrated to match your moment and mood.',
      image: 'assets/images/invites/3.webp',
      startingPrice: 3999
    }
  ];

  selectedWorkshop: Workshop | null = null;
  selectedInviteType: InviteType | null = null;

  workshopForm = {
    name: '',
    email: '',
    phone: '',
    details: ''
  };

  inviteForm = {
    name: '',
    email: '',
    phone: '',
    date: '',
    details: ''
  };

  showCorporate = false;
  corporateForm = {
    name: '',
    email: '',
    phone: '',
    date: '',
    details: ''
  };

  minDate: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private experienceApiService: ExperienceApiService,
    private notificationService: NotificationService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    const today = new Date();
    today.setDate(today.getDate() + 14);
    this.minDate = today.toISOString().split('T')[0];
  }

  private disableScroll() {
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }

  private enableScroll() {
    this.renderer.removeStyle(this.document.body, 'overflow');
  }

  closeForms() {
    this.selectedWorkshop = null;
    this.selectedInviteType = null;
    this.showCorporate = false;
    this.enableScroll();
  }

  showWorkshopForm(workshop: Workshop) {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to register for workshops.');
      this.router.navigate(['/login']);
      return;
    }
    this.selectedWorkshop = workshop;
    this.workshopForm = {
      name: '',
      email: '',
      phone: '',
      details: ''
    };
    this.disableScroll();
  }

  showInviteForm(inviteType: InviteType) {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to request an invite quote.');
      this.router.navigate(['/login']);
      return;
    }
    this.selectedInviteType = inviteType;
    this.inviteForm = {
      name: '',
      email: '',
      phone: '',
      date: '',
      details: ''
    };
    this.disableScroll();
  }

  showCorporateForm() {
    if (!this.authService.isLoggedIn()) {
      alert('Please log in to inquire about private events.');
      this.router.navigate(['/login']);
      return;
    }
    this.showCorporate = true;
    this.corporateForm = {
      name: '',
      email: '',
      phone: '',
      date: '',
      details: ''
    };
    this.disableScroll();
  }

  submitWorkshopInterest() {
    if (!this.selectedWorkshop) return;

    const payload = {
      name: this.workshopForm.name,
      phone: this.workshopForm.phone,
      email: this.workshopForm.email,
      eventType: this.selectedWorkshop.title,
      message: this.workshopForm.details
    };

    this.experienceApiService.registerInterest(payload).subscribe({
      next: () => {
        this.notificationService.success('Thank you for your interest! We will contact you soon.');
        this.closeForms();
      },
      error: (err) => {
        console.error('Error submitting workshop interest', err);
        this.notificationService.error('Something went wrong. Please try again.');
      }
    });
  }

  submitInviteRequest() {
    if (!this.selectedInviteType) return;

    const payload = {
      name: this.inviteForm.name,
      phone: this.inviteForm.phone,
      email: this.inviteForm.email,
      eventType: this.selectedInviteType.title,
      estimatedEventDate: this.inviteForm.date,
      message: this.inviteForm.details
    };

    this.experienceApiService.registerInterest(payload).subscribe({
      next: () => {
        this.notificationService.success('Thank you for your request! We will get back to you with a quote soon.');
        this.closeForms();
      },
      error: (err) => {
        console.error('Error submitting invite request', err);
        this.notificationService.error('Something went wrong. Please try again.');
      }
    });
  }

  submitCorporateRequest() {
    const payload = {
      name: this.corporateForm.name,
      phone: this.corporateForm.phone,
      email: this.corporateForm.email,
      eventType: 'Private Events & Retreats',
      estimatedEventDate: this.corporateForm.date,
      message: this.corporateForm.details
    };

    this.experienceApiService.registerInterest(payload).subscribe({
      next: () => {
        this.notificationService.success('Thank you for your interest! We will get back to you soon.');
        this.closeForms();
      },
      error: (err) => {
        console.error('Error submitting corporate request', err);
        this.notificationService.error('Something went wrong. Please try again.');
      }
    });
  }
}
