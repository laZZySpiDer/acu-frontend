import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WishlistItem } from '../interfaces/wishlist.interface';


@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItems = new BehaviorSubject<WishlistItem[]>([]);
  wishlistItems$ = this.wishlistItems.asObservable();

  private wishlistCount = new BehaviorSubject<number>(0);
  wishlistCount$ = this.wishlistCount.asObservable();

  constructor() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      const items = JSON.parse(savedWishlist);
      this.wishlistItems.next(items);
      this.updateWishlistStats();
    }
  }

  private updateWishlistStats() {
    const items = this.wishlistItems.value;
    this.wishlistCount.next(items.length);
    localStorage.setItem('wishlist', JSON.stringify(items));
  }

  getWishlistItems(): WishlistItem[] {
    return this.wishlistItems.value;
  }

  addToWishlist(item: WishlistItem) {
    const currentItems = this.wishlistItems.value;
    const existingItem = currentItems.find(i => i.id === item.id);

    if (!existingItem) {
      this.wishlistItems.next([...currentItems, item]);
      this.updateWishlistStats();
    }
  }

  removeFromWishlist(itemId: number) {
    const currentItems = this.wishlistItems.value;
    const updatedItems = currentItems.filter(i => i.id !== itemId);
    
    this.wishlistItems.next(updatedItems);
    this.updateWishlistStats();
  }

  isInWishlist(itemId: number): boolean {
    return this.wishlistItems.value.some(item => item.id === itemId);
  }

  clearWishlist() {
    this.wishlistItems.next([]);
    this.updateWishlistStats();
  }
}