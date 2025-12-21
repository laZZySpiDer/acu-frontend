import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ProductsApiService } from "../../services/products-api.service";
import { Product } from "../../interfaces/products/product.interface";
import { Category } from "../../interfaces/category.interface";
import { CartService } from "../../services/cart.service";
import { WishlistService } from "../../services/wishlist.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-categories",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./categories.component.html",
  styleUrl: "./categories.component.css"
})
export class CategoriesComponent implements OnInit {
  public categorySlug: string | null = null;
  products: Product[] = [
    // Add more products as needed
  ];
  constructor(
    private route: ActivatedRoute,
    private _productsApiService: ProductsApiService,
    private cartService: CartService, private wishlistService: WishlistService
  ) {
    console.log(this.route.snapshot.paramMap.get("category"));
    this.categorySlug = this.route.snapshot.paramMap.get("category");
  }

  ngOnInit(): void {
    // Use this._categorySlug to fetch and display category-specific data
    if (this.categorySlug) {
      this._productsApiService
        .getProductByCategory(this.categorySlug)
        .subscribe((response: any) => {

          this.products = response.products;

          this.products.forEach((product) => {
            if (product.sizes.length > 0) {
              product.price = product.sizes[0].price.toString();
              product.stockQuantity = product.sizes[0].stockQuantity.toString();
              product.dimensions = product.sizes[0].dimensions;
              product.weight = product.sizes[0].weight.toString();
              product.material = product.sizes[0].material;
              product.generalImages = product.sizes[0].images;
            }
          });


        });
    }
  }

  viewMode: "grid" | "list" = "grid";
  sortBy: string = "newest";
  showMobileFilters = false;

  filters = {
    minPrice: null as number | null,
    maxPrice: null as number | null,
    inStock: false,
    minRating: null as number | null,
  };

  // categories: Category[] = [];





  get filteredProducts(): Product[] {

    return this.products
      .filter((product) => {
        if (this.filters.minPrice && +product.price < this.filters.minPrice)
          return false;
        if (this.filters.maxPrice && +product.price > this.filters.maxPrice)
          return false;

        if (this.filters.inStock && !product.stockQuantity) return false;
        if (this.filters.minRating && (product.averageRating ?? 0) < this.filters.minRating) return false;
        return true;
      })
      .sort((a, b) => {
        switch (this.sortBy) {
          case "price-low":
            return +a.price - +b.price;
          case "price-high":
            return +b.price - +a.price;
          case "rating":
            return (b.averageRating ?? 0) - (a.averageRating ?? 0);
          default: // newest
            return b.id - a.id;
        }
      });
  }


  clearFilters() {
    this.filters = {
      minPrice: null,
      maxPrice: null,
      inStock: false,
      minRating: null,
    };
    this.sortBy = "newest";
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === "grid" ? "list" : "grid";
  }

  addToCart(product: Product) {
    this.cartService.addToCart({
      productId: product.id.toString(),
      productName: product.name,
      price: +product.price,
      mainImageLink: product.generalImages[0],
      quantity: 1,
      size: product.sizes[0],
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
        price: +product.price,
        image: product.generalImages[0].imageLink,
        category: product.category.name,
        rating: 5,
        reviews: 5,
      });
    }
  }
}
