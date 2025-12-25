import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { WishlistItem } from '../interfaces/wishlist.interface';
import { ApiUrlConstants } from '../constants/url.constants';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<WishlistItem[]>([]);
  wishlistItems$ = this.wishlistItems.asObservable();

  private wishlistCount = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCount.asObservable();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.getWishlist();
      } else {
        this.clearWishlist();
      }
    });
  }

  getWishlist() {
    this.http.get<any>(ApiUrlConstants.WISHLIST_GET).subscribe({
      next: (response) => {
        // Response is { items: [...] }
        const items = response.items || [];

        const mappedItems: WishlistItem[] = items.map((item: any) => {
          // Handle image mapping
          let imageUrl = '';
          if (item.mainImageLink) {
            imageUrl = typeof item.mainImageLink === 'string' ? item.mainImageLink : item.mainImageLink.imageLink;
          } else if (item.image) {
            imageUrl = item.image;
          }

          const salePrice = item.salePrice ? +item.salePrice : null;
          const regularPrice = +item.price;

          return {
            id: +(item.productId || item.id),
            name: item.name,
            price: salePrice || regularPrice,
            originalPrice: salePrice ? regularPrice : undefined,
            image: imageUrl,
            category: item.category || '',
            rating: item.averageRating || 0,
            reviews: item.ratingsCount || 0
          };
        });
        this.wishlistItems.next(mappedItems);
        this.wishlistCount.next(mappedItems.length);
      },
      error: (err) => console.error('Failed to fetch wishlist', err)
    });
  }

  addToWishlist(productId: number) {
    // Optimistic check
    if (this.isInWishlist(productId)) {
      this.notificationService.info('Product is already in wishlist');
      return;
    }

    this.http.post(ApiUrlConstants.WISHLIST_ADD, { product_id: productId }).subscribe({
      next: () => {
        this.notificationService.success('Added to wishlist');
        this.getWishlist();
      },
      error: () => this.notificationService.error('Failed to add to wishlist')
    });
  }

  removeFromWishlist(productId: number) {
    this.http.delete(`${ApiUrlConstants.WISHLIST_REMOVE}/${productId}`).subscribe({
      next: () => {
        this.notificationService.success('Removed from wishlist');
        this.getWishlist();
      },
      error: () => this.notificationService.error('Failed to remove from wishlist')
    });
  }

  isInWishlist(productId: number | string): boolean {
    return this.wishlistItems.value.some(item => item.id === +productId);
  }

  clearWishlist() {
    this.wishlistItems.next([]);
    this.wishlistCount.next(0);
  }
}