import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartComponent } from '../cart/cart.component';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule,CartComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
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

  constructor(private cartService: CartService,private wishlistService: WishlistService, private authService: AuthService) {}

  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout(){
    this.showDropdown = false;
    console.log('logout');
  }
}