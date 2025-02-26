import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
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

  constructor(private cartService: CartService) {}


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

  toggleViewMode() {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  addToCart(product: Product) {
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      color:  undefined,
      size: undefined
    });
  }
}