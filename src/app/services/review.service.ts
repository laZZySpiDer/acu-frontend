import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface Review {
  id: string;
  productId: number;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: Date;
  helpful?: number;
  images?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private reviews: { [key: number]: Review[] } = {
    1: [
      {
        id: '1',
        productId: 1,
        userId: '456',
        userName: 'Sarah Johnson',
        userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        rating: 5,
        comment: 'Beautiful craftsmanship! The basket is even more stunning in person.',
        createdAt: new Date('2024-02-15'),
        helpful: 12
      },
      {
        id: '2',
        productId: 1,
        userId: '789',
        userName: 'Michael Chen',
        userAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        rating: 4,
        comment: 'Great quality and perfect size for my needs. Would buy again.',
        createdAt: new Date('2024-02-10'),
        helpful: 8
      }
    ]
  };

  private reviewsSubject = new BehaviorSubject<{ [key: number]: Review[] }>(this.reviews);

  getProductReviews(productId: number): Observable<Review[]> {
    return of(this.reviews[productId] || []).pipe(delay(500));
  }

  addReview(review: Omit<Review, 'id' | 'createdAt' | 'helpful'>): Observable<Review> {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      helpful: 0
    };

    if (!this.reviews[review.productId]) {
      this.reviews[review.productId] = [];
    }

    this.reviews[review.productId].unshift(newReview);
    this.reviewsSubject.next(this.reviews);

    return of(newReview).pipe(delay(500));
  }

  // markHelpful(reviewId: string, productId: number): Observable<void> {
  //   const review = this.reviews[productId]?.find(r => r.id === reviewId);
  //   if (review) {
  //     review.helpful += 1;
  //     this.reviewsSubject.next(this.reviews);
  //   }
  //   return of(void 0).pipe(delay(200));
  // }
}