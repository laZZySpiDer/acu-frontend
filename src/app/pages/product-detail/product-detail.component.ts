import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  images: string[];
  inStock: boolean;
  description: string;
  details: {
    material: string;
    dimensions: string;
    weight: string;
  };
  colors?: string[];
  sizes?: string[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="container py-8 mt-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Left Side: Product Images -->
        <div>
          <div class="relative overflow-hidden rounded-lg mb-4">
            <img [src]="selectedImage" 
                 [alt]="product.name"
                 class="w-full h-[500px] object-cover"/>
            <!-- Image Zoom Overlay -->
            <div class="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition-opacity cursor-zoom-in"></div>
          </div>
          <!-- Thumbnails -->
          <div class="grid grid-cols-4 gap-2">
            <button *ngFor="let image of product.images"
                    (click)="selectedImage = image"
                    class="rounded-lg overflow-hidden"
                    [class.ring-2]="selectedImage === image"
                    [class.ring-primary]="selectedImage === image">
              <img [src]="image" 
                   [alt]="product.name"
                   class="w-full h-24 object-cover"/>
            </button>
          </div>
        </div>

        <!-- Right Side: Product Details -->
        <div>
          <h1 class="text-3xl font-bold mb-4">{{product.name}}</h1>
          
          <!-- Rating -->
          <div class="flex items-center mb-4">
            <div class="flex text-yellow-400">
              <i *ngFor="let star of [1,2,3,4,5]"
                 class="fas fa-star"
                 [class.text-gray-300]="star > product.rating"></i>
            </div>
            <span class="ml-2 text-gray-600">{{product.reviews}} reviews</span>
          </div>

          <!-- Price -->
          <p class="text-2xl font-bold text-primary mb-6">\${{product.price.toFixed(2)}}</p>

          <!-- Description -->
          <p class="text-gray-600 mb-6">{{product.description}}</p>

          <!-- Color Selection -->
          <div *ngIf="product.colors" class="mb-6">
            <h3 class="font-semibold mb-2">Color</h3>
            <div class="flex gap-2">
              <button *ngFor="let color of product.colors"
                      (click)="selectedColor = color"
                      [class.ring-2]="selectedColor === color"
                      [class.ring-primary]="selectedColor === color"
                      class="w-8 h-8 rounded-full"
                      [style.background-color]="color">
              </button>
            </div>
          </div>

          <!-- Size Selection -->
          <div *ngIf="product.sizes" class="mb-6">
            <h3 class="font-semibold mb-2">Size</h3>
            <div class="flex gap-2">
              <button *ngFor="let size of product.sizes"
                      (click)="selectedSize = size"
                      [class.bg-primary]="selectedSize === size"
                      [class.text-white]="selectedSize === size"
                      class="px-4 py-2 border rounded-md hover:border-primary">
                {{size}}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div class="mb-6">
            <h3 class="font-semibold mb-2">Quantity</h3>
            <div class="flex items-center gap-2">
              <button (click)="quantity = Math.max(1, quantity - 1)"
                      class="px-3 py-1 border rounded-md">
                <i class="fas fa-minus"></i>
              </button>
              <input type="number"
                     [(ngModel)]="quantity"
                     min="1"
                     class="w-16 text-center border rounded-md px-2 py-1"/>
              <button (click)="quantity = quantity + 1"
                      class="px-3 py-1 border rounded-md">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <!-- Add to Cart & Buy Now -->
          <div class="flex gap-4 mb-8">
            <button class="flex-1 btn-primary">Add to Cart</button>
            <button class="flex-1 btn-secondary">Buy Now</button>
          </div>

          <!-- Product Details -->
          <div class="border-t pt-6">
            <h3 class="font-semibold mb-4">Product Details</h3>
            <dl class="grid grid-cols-1 gap-2">
              <div class="grid grid-cols-2">
                <dt class="text-gray-600">Material</dt>
                <dd>{{product.details.material}}</dd>
              </div>
              <div class="grid grid-cols-2">
                <dt class="text-gray-600">Dimensions</dt>
                <dd>{{product.details.dimensions}}</dd>
              </div>
              <div class="grid grid-cols-2">
                <dt class="text-gray-600">Weight</dt>
                <dd>{{product.details.weight}}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <section class="mt-16">
        <h2 class="text-2xl font-bold mb-8">Customer Reviews</h2>
        <!-- Review Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div class="flex items-center gap-4">
            <div class="text-4xl font-bold">{{product.rating}}</div>
            <div>
              <div class="flex text-yellow-400 mb-1">
                <i *ngFor="let star of [1,2,3,4,5]"
                   class="fas fa-star"
                   [class.text-gray-300]="star > product.rating"></i>
              </div>
              <p class="text-gray-600">Based on {{product.reviews}} reviews</p>
            </div>
          </div>
        </div>
        <!-- Individual Reviews -->
        <div class="space-y-6">
          <div *ngFor="let review of reviews" class="border-b pb-6">
            <div class="flex items-center gap-4 mb-4">
              <img [src]="review.avatar" 
                   [alt]="review.name"
                   class="w-12 h-12 rounded-full object-cover"/>
              <div>
                <h4 class="font-semibold">{{review.name}}</h4>
                <div class="flex text-yellow-400">
                  <i *ngFor="let star of [1,2,3,4,5]"
                     class="fas fa-star text-sm"
                     [class.text-gray-300]="star > review.rating"></i>
                </div>
              </div>
              <span class="ml-auto text-gray-500">{{review.date}}</span>
            </div>
            <p class="text-gray-600">{{review.comment}}</p>
          </div>
        </div>
      </section>
    </main>
    <app-footer></app-footer>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product = {
    id: 1,
    name: 'Handwoven Basket',
    price: 49.99,
    rating: 5,
    reviews: 128,
    category: 'Home Decor',
    images: [
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    inStock: true,
    description: 'Handcrafted by skilled artisans, this beautiful basket is perfect for storage and decoration. Each piece is unique and made with sustainable materials.',
    details: {
      material: 'Natural Seagrass',
      dimensions: '12" x 12" x 14"',
      weight: '2.5 lbs'
    },
    colors: ['#8B4513', '#D2691E', '#DEB887'],
    sizes: ['Small', 'Medium', 'Large']
  };

  reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Beautiful craftsmanship! The basket is even more stunning in person.',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      date: '2024-02-15'
    },
    {
      name: 'Michael Chen',
      rating: 4,
      comment: 'Great quality and perfect size for my needs. Would buy again.',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      date: '2024-02-10'
    }
  ];

  selectedImage: string = '';
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  quantity: number = 1;
  Math = Math;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.selectedImage = this.product.images[0];
    if (this.product.colors) {
      this.selectedColor = this.product.colors[0];
    }
    if (this.product.sizes) {
      this.selectedSize = this.product.sizes[0];
    }
  }
}