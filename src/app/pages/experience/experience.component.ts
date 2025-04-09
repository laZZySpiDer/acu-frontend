import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Workshop, InviteType} from '../../interfaces/experience.interface';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent {
  workshops: Workshop[] = [
    {
      id: 'doll-painting',
      title: 'Doll Painting Workshop',
      description: 'Learn the art of doll painting and create your own unique masterpiece.',
      image: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      duration: '3 hours',
      price: 49.99
    },
    {
      id: 'clay-magnets',
      title: 'Clay Magnets Workshop',
      description: 'Create adorable clay magnets with professional guidance.',
      image: 'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      duration: '2 hours',
      price: 39.99
    },
    {
      id: 'doodling',
      title: 'Doodling Workshop',
      description: 'Express yourself through creative doodling techniques.',
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      duration: '2.5 hours',
      price: 34.99
    },
    {
      id: 'canvas',
      title: 'Canvas Workshop',
      description: 'Learn various canvas painting techniques and create your own artwork.',
      image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      duration: '4 hours',
      price: 59.99
    }
  ];

  inviteTypes: InviteType[] = [
    {
      id: 'wedding',
      title: 'Wedding Invitations',
      description: 'Elegant digital invitations for your special day.',
      image: 'https://images.unsplash.com/photo-1511184150666-9bb7d41a88f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      startingPrice: 99.99
    },
    {
      id: 'baby-shower',
      title: 'Baby Shower Invitations',
      description: 'Cute and customizable digital invites for your baby shower.',
      image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      startingPrice: 49.99
    },
    {
      id: 'custom',
      title: 'Custom Invitations',
      description: 'Personalized digital invitations for any occasion.',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      startingPrice: 79.99
    }
  ];

  selectedWorkshop: Workshop | null = null;
  selectedInviteType: InviteType | null = null;

  workshopForm = {
    name: '',
    email: ''
  };

  inviteForm = {
    name: '',
    email: '',
    phone: '',
    details: ''
  };

  showWorkshopForm(workshop: Workshop) {
    this.selectedWorkshop = workshop;
    this.workshopForm = {
      name: '',
      email: ''
    };
  }

  showInviteForm(inviteType: InviteType) {
    this.selectedInviteType = inviteType;
    this.inviteForm = {
      name: '',
      email: '',
      phone: '',
      details: ''
    };
  }

  submitWorkshopInterest() {
    console.log('Workshop Interest:', {
      workshop: this.selectedWorkshop?.title,
      ...this.workshopForm
    });
    
    alert('Thank you for your interest! We will contact you soon.');
    this.selectedWorkshop = null;
  }

  submitInviteRequest() {
    console.log('Invite Request:', {
      type: this.selectedInviteType?.title,
      ...this.inviteForm
    });
    
    alert('Thank you for your request! We will get back to you with a quote soon.');
    this.selectedInviteType = null;
  }
 }
