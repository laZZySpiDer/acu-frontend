import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { RouterModule } from '@angular/router';
import { ProductsApiService } from '../../services/products-api.service';
import { Product } from '../../interfaces/product.interface';

// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   rating: number;
//   reviews: number;
//   category: string;
//   images: string[];
//   inStock: boolean;
// }

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
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

  products : Product[] = [
    // Add more products as needed
  ];

  constructor(private wishlistService: WishlistService,private cartService: CartService, private productsApiService: ProductsApiService) {}
  
    ngOnInit() {
      this.productsApiService.getProducts().subscribe((products:any) => {
        console.log(products);
        this.products = products.products;
        console.log(this.products);
        this.products.forEach(product => {
          if(product.sizes.length > 0){
            product.price = product.sizes[0].price;
            product.stock_quantity = product.sizes[0].stock_quantity;
            product.dimensions = product.sizes[0].dimensions;
            product.weight = product.sizes[0].weight;
            product.material = product.sizes[0].material;
            product.general_images = product.sizes[0].images;
          }
        })
      });
    }
  


  get filteredProducts(): Product[] {
    return this.products
      .filter(product => {
        if (this.filters.minPrice && product.price < this.filters.minPrice) return false;
        if (this.filters.maxPrice && product.price > this.filters.maxPrice) return false;
        if (this.filters.categories.length && !this.filters.categories.includes(product.category.name)) return false;
        if (this.filters.inStock && !product.stock_quantity) return false;
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
      image: product.general_images[0].image_link,
      quantity: 1,
      color:  undefined,
      size: undefined
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  toggleWishlist(product: Product) {
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
    } else {
      this.wishlistService.addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.general_images[0].image_link,
        category: product.category.name,
        rating: product.rating,
        reviews: product.reviews
      });
    }
  }
}