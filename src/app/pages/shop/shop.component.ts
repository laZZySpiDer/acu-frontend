import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
}

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="container py-8 mt-20">
      <!-- Page Header -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">Shop</h1>
        <div class="flex items-center gap-4">
          <!-- View Toggle -->
          <div class="flex gap-2">
            <button 
              (click)="viewMode = 'grid'"
              [class.text-primary]="viewMode === 'grid'"
              class="p-2">
              <i class="fas fa-grid-2 text-lg"></i>
            </button>
            <button 
              (click)="viewMode = 'list'"
              [class.text-primary]="viewMode === 'list'"
              class="p-2">
              <i class="fas fa-list text-lg"></i>
            </button>
          </div>
          <!-- Sort Dropdown -->
          <select 
            [(ngModel)]="sortBy"
            class="border rounded-md px-3 py-2 focus:outline-none focus:border-primary">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div class="flex gap-8">
        <!-- Sidebar Filters -->
        <aside class="w-64 flex-shrink-0">
          <div class="bg-white rounded-lg shadow-md p-6">
            <!-- Price Range -->
            <div class="mb-6">
              <h3 class="font-semibold mb-3">Price Range</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input type="number" 
                         [(ngModel)]="filters.minPrice"
                         class="w-24 border rounded px-2 py-1" 
                         placeholder="Min"/>
                  <span class="mx-2">-</span>
                  <input type="number" 
                         [(ngModel)]="filters.maxPrice"
                         class="w-24 border rounded px-2 py-1" 
                         placeholder="Max"/>
                </div>
              </div>
            </div>

            <!-- Categories -->
            <div class="mb-6">
              <h3 class="font-semibold mb-3">Categories</h3>
              <div class="space-y-2">
                <label *ngFor="let category of categories" class="flex items-center">
                  <input type="checkbox"
                         [checked]="filters.categories.includes(category)"
                         (change)="toggleCategory(category)"
                         class="mr-2"/>
                  {{category}}
                </label>
              </div>
            </div>

            <!-- Availability -->
            <div class="mb-6">
              <h3 class="font-semibold mb-3">Availability</h3>
              <label class="flex items-center">
                <input type="checkbox"
                       [(ngModel)]="filters.inStock"
                       class="mr-2"/>
                In Stock Only
              </label>
            </div>

            <!-- Ratings -->
            <div class="mb-6">
              <h3 class="font-semibold mb-3">Customer Ratings</h3>
              <div class="space-y-2">
                <label *ngFor="let rating of [4,3,2,1]" class="flex items-center">
                  <input type="radio"
                         name="rating"
                         [value]="rating"
                         [(ngModel)]="filters.minRating"
                         class="mr-2"/>
                  <div class="flex text-yellow-400">
                    <i *ngFor="let star of [1,2,3,4,5]"
                       class="fas fa-star text-sm"
                       [class.text-gray-300]="star > rating"></i>
                  </div>
                  <span class="ml-2">& Up</span>
                </label>
              </div>
            </div>

            <!-- Clear Filters -->
            <button (click)="clearFilters()"
                    class="w-full btn-secondary">
              Clear Filters
            </button>
          </div>
        </aside>

        <!-- Product Grid/List -->
        <div class="flex-1">
          <div [class]="viewMode === 'grid' ? 
                       'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
                       'space-y-6'">
            <div *ngFor="let product of filteredProducts" 
                 [class]="viewMode === 'grid' ? 
                         'product-card group' : 
                         'product-card group flex gap-6'">
              <!-- Product Image -->
              <div [class]="viewMode === 'grid' ? 
                           'relative overflow-hidden' :
                           'relative overflow-hidden w-48'">
                <img [src]="product.images[0]" 
                     [alt]="product.name"
                     class="w-full h-64 object-cover"/>
                <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="btn-primary mx-2">Quick View</button>
                  <button class="text-white">
                    <i class="fas fa-heart text-2xl"></i>
                  </button>
                </div>
              </div>
              <!-- Product Info -->
              <div [class]="viewMode === 'grid' ? 'p-4' : 'flex-1 p-4'">
                <h3 class="text-lg font-semibold mb-2">{{product.name}}</h3>
                <div class="flex items-center mb-2">
                  <div class="flex text-yellow-400">
                    <i *ngFor="let star of [1,2,3,4,5]"
                       class="fas fa-star text-sm"
                       [class.text-gray-300]="star > product.rating"></i>
                  </div>
                  <span class="text-sm text-gray-500 ml-2">({{product.reviews}})</span>
                </div>
                <p class="text-primary font-bold mb-2">\${{product.price.toFixed(2)}}</p>
                <p *ngIf="viewMode === 'list'" class="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <button *ngIf="viewMode === 'list'"
                        class="btn-primary">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <app-footer></app-footer>
  `
})
export class ShopComponent {
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'newest';
  
  filters = {
    minPrice: null as number | null,
    maxPrice: null as number | null,
    categories: [] as string[],
    inStock: false,
    minRating: null as number | null
  };

  categories = [
    'Handmade Crafts',
    'Accessories',
    'Apparel',
    'Home Decor',
    'Art & Collectibles',
    'Jewelry'
  ];

  products: Product[] = [
    {
      id: 1,
      name: 'Handwoven Basket',
      price: 49.99,
      rating: 5,
      reviews: 128,
      category: 'Home Decor',
      images: ['https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
      inStock: true
    },
    {
      id: 2,
      name: 'Ceramic Vase',
      price: 34.99,
      rating: 4,
      reviews: 89,
      category: 'Home Decor',
      images: ['https://images.unsplash.com/photo-1578500351865-0a4734e8cd6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
      inStock: true
    },
    {
      id: 3,
      name: 'Macrame Wall Hanging',
      price: 79.99,
      rating: 5,
      reviews: 156,
      category: 'Home Decor',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
      inStock: false
    },
    {
      id: 4,
      name: 'Handmade Soap Set',
      price: 24.99,
      rating: 4,
      reviews: 67,
      category: 'Handmade Crafts',
      images: ['https://images.unsplash.com/photo-1600857062241-98e5dba7f214?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'],
      inStock: true
    },
    // Add more products as needed
  ];

  get filteredProducts(): Product[] {
    return this.products
      .filter(product => {
        if (this.filters.minPrice && product.price < this.filters.minPrice) return false;
        if (this.filters.maxPrice && product.price > this.filters.maxPrice) return false;
        if (this.filters.categories.length && !this.filters.categories.includes(product.category)) return false;
        if (this.filters.inStock && !product.inStock) return false;
        if (this.filters.minRating && product.rating < this.filters.minRating) return false;
        return true;
      })
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          default: // newest
            return b.id - a.id;
        }
      });
  }

  toggleCategory(category: string) {
    const index = this.filters.categories.indexOf(category);
    if (index === -1) {
      this.filters.categories.push(category);
    } else {
      this.filters.categories.splice(index, 1);
    }
  }

  clearFilters() {
    this.filters = {
      minPrice: null,
      maxPrice: null,
      categories: [],
      inStock: false,
      minRating: null
    };
    this.sortBy = 'newest';
  }
}