import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { RouterModule } from '@angular/router';
import { ProductsApiService } from '../../services/products-api.service';
// import { Product } from '../../interfaces/product.interface';
import { Category } from '../../interfaces/category.interface';
import { Product } from '../../interfaces/products/product.interface';



@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = 'newest';
  showMobileFilters = false;

  filters = {
    minPrice: null as number | null,
    maxPrice: null as number | null,
    categories: [] as string[],
    inStock: false,
    minRating: null as number | null
  };

  categories: Category[] = [];

  products: Product[] = [
    // Add more products as needed
  ];

  constructor(private wishlistService: WishlistService, private cartService: CartService, private productsApiService: ProductsApiService) { }

  ngOnInit() {

    this.getProducts();
    this.getCategories();

  }

  getCategories() {
    this.productsApiService.getCategories().subscribe((categories: any) => {
      this.categories = categories.categories.filter((elem: any) => elem.parent_category_id === null);
      console.log(this.categories);
    });
  }

  getProducts() {
    this.productsApiService.getProducts().subscribe((products: any) => {
      console.log(products);
      this.products = products.products;
      console.log(this.products);
      this.products.forEach(product => {
        if (product.sizes.length > 0) {
          product.price = product.sizes[0].price.toString();
          product.salePrice = product.sizes[0].salePrice;
          product.stockQuantity = product.sizes[0].stockQuantity.toString();
          product.dimensions = product.sizes[0].dimensions;
          product.weight = product.sizes[0].weight.toString();
          product.material = product.sizes[0].material;
          product.generalImages = product.sizes[0].images;
        }
      })
    });
  }


  get filteredProducts(): Product[] {
    return this.products
      .filter(product => {
        if (this.filters.minPrice && +product.price < this.filters.minPrice) return false;
        if (this.filters.maxPrice && +product.price > this.filters.maxPrice) return false;
        if (this.filters.categories.length && !this.filters.categories.includes(product.category.name)) return false;
        if (this.filters.inStock && !product.stockQuantity) return false;
        if (this.filters.minRating && (product.averageRating ?? 0) < this.filters.minRating) return false;
        return true;
      })
      .sort((a, b) => {
        switch (this.sortBy) {
          case 'price-low':
            return +a.price - +b.price;
          case 'price-high':
            return +b.price - +a.price;
          case 'rating':
            return (b.averageRating ?? 0) - (a.averageRating ?? 0);
          default: // newest
            return b.id - a.id;
        }
      });
  }

  toggleCategory(category: Category) {
    const index = this.filters.categories.indexOf(category.name);
    if (index === -1) {
      this.filters.categories.push(category.name);
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
    const finalPrice = product.salePrice ?? +product.price;
    this.cartService.addToCart({
      productId: product.id.toString(),
      productName: product.name,
      price: finalPrice,
      originalPrice: product.salePrice ? +product.price : undefined,
      mainImageLink: product.generalImages[0],
      quantity: 1,
      size: product.sizes[0]
    });
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }

  toggleWishlist(product: Product) {
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id);
    } else {
      this.wishlistService.addToWishlist(product.id);
    }
  }
}