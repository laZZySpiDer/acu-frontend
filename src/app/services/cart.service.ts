import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  private cartTotal = new BehaviorSubject<number>(0);
  cartTotal$ = this.cartTotal.asObservable();

  constructor() {
    // Load cart from localStorage on initialization
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      this.cartItems.next(items);
      this.updateCartStats();
    }
  }

  private updateCartStats() {
    const items = this.cartItems.value;
    const count = items.reduce((total, item) => total + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    this.cartCount.next(count);
    this.cartTotal.next(total);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(items));
  }

  getCartTotal(): number {
    return this.cartTotal.value;
  }

  addToCart(item: CartItem) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => 
      i.id === item.id && 
      i.color === item.color && 
      i.size === item.size
    );

    if (existingItem) {
      existingItem.quantity += item.quantity;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, item]);
    }

    this.updateCartStats();
  }

  removeFromCart(item: CartItem) {
    const currentItems = this.cartItems.value;
    const updatedItems = currentItems.filter(i => 
      !(i.id === item.id && i.color === item.color && i.size === item.size)
    );
    
    this.cartItems.next(updatedItems);
    this.updateCartStats();
  }

  updateQuantity(item: CartItem, quantity: number) {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(i => 
      i.id === item.id && 
      i.color === item.color && 
      i.size === item.size
    );

    if (existingItem) {
      existingItem.quantity = quantity;
      this.cartItems.next([...currentItems]);
      this.updateCartStats();
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.updateCartStats();
  }
}