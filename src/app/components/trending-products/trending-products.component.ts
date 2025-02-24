import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trending-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-white">
      <div class="container">
        <h2 class="section-title">Trending Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let product of products" class="product-card group">
            <div class="relative overflow-hidden">
              <img [src]="product.image" [alt]="product.name" class="w-full h-64 object-cover"/>
              <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="btn-primary mx-2">Quick View</button>
                <button class="text-white">
                  <i class="fas fa-heart text-2xl"></i>
                </button>
              </div>
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold mb-2">{{product.name}}</h3>
              <div class="flex items-center mb-2">
                <div class="flex text-yellow-400">
                  <i *ngFor="let star of [1,2,3,4,5]" 
                     class="fas fa-star text-sm"
                     [class.text-gray-300]="star > product.rating"></i>
                </div>
                <span class="text-sm text-gray-500 ml-2">({{product.reviews}})</span>
              </div>
              <p class="text-primary font-bold">\${{product.price}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class TrendingProductsComponent {
  products = [
    {
      name: 'Handwoven Basket',
      price: '49.99',
      rating: 5,
      reviews: 128,
      image: 'https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      name: 'Ceramic Vase',
      price: '34.99',
      rating: 4,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1578500351865-0a4734e8cd6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
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
}