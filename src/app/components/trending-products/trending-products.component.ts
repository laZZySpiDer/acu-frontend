import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductCardComponent } from "../product-card/product-card.component";
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ProductsApiService } from '../../services/products-api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-trending-products',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './trending-products.component.html',
  styleUrls: ['./trending-products.component.css'],
  providers: [ProductsApiService,HttpClient]
})
export class TrendingProductsComponent implements OnInit {
  products = [
    {
      name: 'Handwoven Basket',
      price: '49.99',
      rating: 5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      name: 'Ceramic Vase',
      price: '34.99',
      rating: 4,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      name: 'Macrame Wall Hanging',
      price: '79.99',
      rating: 5,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      name: 'Handmade Soap Set',
      price: '24.99',
      rating: 4,
      reviews: 67,
      image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];


  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private productsApiService: ProductsApiService,
  ) {}


  ngOnInit() {
    this.productsApiService.getProducts().subscribe((products:any) => {
      console.log(products);
      this.products = products.products;
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
      id: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.image,
      quantity: 1
    });
  }


}