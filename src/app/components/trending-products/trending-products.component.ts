import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductCardComponent } from "../product-card/product-card.component";
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ProductsApiService } from '../../services/products-api.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../../interfaces/products/product.interface';

@Component({
  selector: 'app-trending-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './trending-products.component.html',
  styleUrls: ['./trending-products.component.css'],
  providers: [ProductsApiService, HttpClient]
})
export class TrendingProductsComponent implements OnInit {
  products: Product[] = [];


  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private productsApiService: ProductsApiService,
  ) { }


  ngOnInit() {
    this.productsApiService.getTrendingProducts().subscribe((res: any) => {
      this.products = res.products;
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  toggleWishlist(product: any) {
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
    } else {
      this.wishlistService.addToWishlist({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        category: product.category,
        rating: product.rating,
        reviews: product.reviews
      });
    }
  }

  addToCart(product: any) {
    this.cartService.addToCart({
      productId: product.id,
      productName: product.name,
      price: parseFloat(product.sizes[0].price),
      mainImageLink: product.image,
      quantity: 1,
      size: product.sizes[0].size
    });
  }


}