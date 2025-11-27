import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-gray-50">
      <div class="container">
        <h2 class="section-title">What Our Customers Say</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div *ngFor="let review of reviews" class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <img [src]="review.avatar" [alt]="review.name" class="w-12 h-12 rounded-full object-cover"/>
              <div class="ml-4">
                <h4 class="font-semibold">{{review.name}}</h4>
                <div class="flex text-yellow-400">
                  <i *ngFor="let star of [1,2,3,4,5]" 
                     class="fas fa-star text-sm"
                     [class.text-gray-300]="star > review.rating"></i>
                </div>
              </div>
            </div>
            <p class="text-gray-600">{{review.comment}}</p>
          </div>
        </div>
      </div>
    </section>
  `
})
export class CustomerReviewsComponent {
  reviews = [
    {
      name: 'Dr. Bhavin Kamani',
      rating: 5,
      comment: 'You made a miracle for Deverra IVF,All the patients are feeling so happy after seeing this. Thank you so much, Ashwini!',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Simran Jain',
      rating: 5,
      comment: 'The precision to replicate pictures into peg dolls is astounding. I asked for a super quick delivery and she managed to complete it within 2 days and ship it. Amazing work, will highly recommend it!',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      name: 'Kishan Sharma',
      rating: 5,
      comment: "The wooden dolls were a MASTERPIECE in UK! 🎨You need a massive round of applause! The gifts were absolutely adored, brilliant, and totally unique. Seriously, they were such a hit, I'm already planning my next order (I want more!). Thank you, thank you, thank you for your incredible effort and generosity. Sending you the biggest hug and tons of love! ❤️✨",
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  ];
}