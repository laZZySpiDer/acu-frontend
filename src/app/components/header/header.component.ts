import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartComponent } from '../cart/cart.component';

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
    }
  ]

  cartCount$ = this.cartService.cartCount$;

  constructor(private cartService: CartService) {}
}