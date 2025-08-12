import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService} from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart/cart.model';
// import { CartItem } from '../../interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'] 
})
export class CartComponent {
  cartItems$ = this.cartService.cartItems$;
  cartTotal$ = this.cartService.cartTotal$;
  isOpen = false;

  constructor(private cartService: CartService) {}

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity >= 1) {
      this.cartService.updateQuantity(item, quantity);
    }
  }

  removeFromCart(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  close() {
    this.isOpen = false;
  }

  open() {
    this.isOpen = true;
  }
}