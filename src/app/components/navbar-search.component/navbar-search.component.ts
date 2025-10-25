import { ChangeDetectionStrategy, Component } from "@angular/core";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { ProductsApiService } from "../../services/products-api.service";
import { Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-navbar-search",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./navbar-search.component.html",
  styleUrl: "./navbar-search.component.css",
})
export class NavbarSearchComponent {
  searchQuery = "";
  results: any[] = [];
  private searchSubject = new Subject<string>();

  constructor(
    private searchService: ProductsApiService,
    private router: Router
  ) {
    // Debounced search
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((query) => {
        if (query.trim().length === 0) {
          this.results = [];
          return;
        }

        this.searchService.searchProducts(query).subscribe({
          next: (data) => (this.results = data),
          error: (err) => console.error("Search error:", err),
        });
      });
  }

  onSearch() {
    this.searchSubject.next(this.searchQuery);
  }

  selectResult(product: any) {
    if (product.productVariantId) {
      const productId = product.productId;
      const variantId = product.productVariantId;
      this.router.navigate(["/product", productId, variantId]);
    } else {
      this.router.navigate(["/product", product.productId]);
    }

    this.results = [];
    this.searchQuery = "";
  }
}
