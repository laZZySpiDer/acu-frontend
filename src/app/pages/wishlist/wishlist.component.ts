import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  wishlistItems$ = this.wishlistService.wishlistItems$;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  removeFromWishlist(itemId: number) {
    this.wishlistService.removeFromWishlist(itemId);
  }

  addToCart(item: any) {
    this.cartService.addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  }
 }
