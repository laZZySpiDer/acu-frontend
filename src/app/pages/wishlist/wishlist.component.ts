import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WishlistService } from '../../services/wishlist.service';

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
    private wishlistService: WishlistService
  ) { }

  removeFromWishlist(itemId: number) {
    this.wishlistService.removeFromWishlist(itemId);
  }
}
