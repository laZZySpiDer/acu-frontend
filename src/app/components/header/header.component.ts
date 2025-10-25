import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartComponent } from '../cart/cart.component';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ProductsApiService } from '../../services/products-api.service';
import { NavbarSearchComponent } from '../navbar-search.component/navbar-search.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,CartComponent,FormsModule, NavbarSearchComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent{
  menuList = [
    {
      name: 'Home',
      link: '/'
    },
    {
      name: 'Shop',
      link: '/shop'
    },
    {
      name: 'Experience',
      link: '/experience'
    }
  ]

  cartCount$ = this.cartService.cartCount$;
  wishlistCount$ = this.wishlistService.wishlistCount$;
  currentUser$ = this.authService.currentUser$;
  showDropdown = false;
  searchQuery: string = '';



  constructor(private cartService: CartService,private wishlistService: WishlistService, private authService: AuthService, private router: Router,private productApiService: ProductsApiService) {}

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(){
    this.showDropdown = false;
    console.log('logout');
    this.authService.logout().subscribe({
      next: (response:any) => {
        console.log('Logout Response',response);
        this.authService.setCurrentUser(null);
        this.router.navigate(['/']);
        this.cartService.clearCart();
        this.wishlistService.clearWishlist();
      }
    });
  }


    onSearch() {
    if (this.searchQuery.trim()) {
      // this.router.navigate(['/shop'], { queryParams: { search: this.searchQuery.trim() } });
      console.log('Search Query:', this.searchQuery.trim());
      this.productApiService.searchProducts(this.searchQuery.trim()).subscribe({
        next: (results:any) => {
          console.log('Search Results:', results);
          // You can navigate to a search results page or display results as needed
          // this.router.navigate(['/shop'], { queryParams: { search: this.searchQuery.trim() } });
        },
        error: (error:any) => {
          console.error('Search Error:', error);
        }
      });
      this.searchQuery = '';
      this.isMobileMenuOpen = false; // Close mobile menu after search
    }
  }
}