import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../interfaces/products/product.interface';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnChanges {

  @Input() product!: Product;
  constructor(private router: Router, private wishlistService: WishlistService,
    private cartService: CartService, private notificationService: NotificationService) { }

  ngOnChanges(changes: any) {
    // console.log('ProductCardComponent changes:', changes);
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  toggleWishlist(product: any) {
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
      this.notificationService.success("Removed from wishlist");
    } else {
      this.wishlistService.addToWishlist({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.main_image_link?.image_link || '',
        category: product.category,
        rating: product.rating,
        reviews: product.reviews
      });
      this.notificationService.success("Added to wishlist");
    }
  }

  addToCart(product: any) {
    this.cartService.addToCart({
      productId: product.id,
      productName: product.name,
      price: parseFloat(product.sizes[0].price),
      mainImageLink: product.main_image_link?.image_link || '',
      quantity: 1,
      size: product.sizes[0]
    });
  }
}
