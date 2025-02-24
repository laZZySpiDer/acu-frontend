import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="py-16 bg-primary">
      <div class="container">
        <div class="text-center text-white">
          <h2 class="text-3xl font-bold mb-4">Subscribe for Exclusive Offers</h2>
          <p class="mb-8">Be the first to know about new collections and special promotions</p>
          <form (submit)="onSubmit($event)" class="max-w-md mx-auto">
            <div class="flex gap-4">
              <input 
                type="email" 
                [(ngModel)]="email"
                name="email"
                placeholder="Enter your email"
                class="flex-1 px-4 py-2 rounded-md text-gray-800 focus:outline-none"
              />
              <button type="submit" class="btn-secondary">Subscribe</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `
})
export class NewsletterComponent {
  email: string = '';

  onSubmit(event: Event) {
    event.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Newsletter subscription:', this.email);
    this.email = '';
  }
}