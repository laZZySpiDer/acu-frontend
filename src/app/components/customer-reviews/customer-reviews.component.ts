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
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Absolutely love the quality of handmade products. The attention to detail is remarkable!',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'Great customer service and unique items that you cannot find anywhere else.',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      name: 'Emily Wilson',
      rating: 4,
      comment: 'Beautiful craftsmanship and fast shipping. Will definitely shop here again!',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
    }
  ];
}