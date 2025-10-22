// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
// import { CartItem } from '../interfaces/cart.interface';
import { CartItem } from '../interfaces/cart/cart.model';
import { ProductsApiService } from './products-api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  cartTotal$ = this.cartItems$.pipe(
    map(items => items.reduce((total, item) => total + (item.price * item.quantity), 0))
  );

  cartCount$ = this.cartItems$.pipe(
    map(items =>
      items.reduce((count, item) => count + item.quantity, 0)
    )
  );

  constructor(
    private _productsApi: ProductsApiService,
    private _authApi: AuthService
  ) {
    this.loadCartItems();

    this._authApi.currentUser$.subscribe(user => {
    if (user) {
      this.loadCartItems();
    }
  });

  }

  getCartTotal(): number {
    return this.cartItems.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  private persistLocalCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
  }

  private loadCartItems() {
    if (this._authApi.isLoggedIn()) {
      this._productsApi.getCart().subscribe((res:any) => {
        console.log('Cart items loaded from API:', res);
        const items : CartItem[] = res.items.map((item: CartItem) => ({
          productId: item.productId,
          quantity: +item.quantity,
          price: typeof item.size.price === 'string' ? parseFloat(item.size.price) : item.size.price,
          productName: item.productName,
          mainImageLink: item.mainImageLink,
          size: item.size
        }));
        this.cartItems.next(items);
        console.log('Cart items loaded:', this.cartItems.value);
      });
    } else {
      const saved = localStorage.getItem('cart');
      this.cartItems.next(saved ? JSON.parse(saved) : []);
    }

    
  }

  addToCart(item: CartItem) {
    const current = [...this.cartItems.value];
    const index = current.findIndex(i =>
      i.cartItemId === item.cartItemId && i.size.productVariantId === item.size.productVariantId
    );

    const newQuantity = index !== -1
      ? current[index].quantity + item.quantity
      : item.quantity;

    if (this._authApi.isLoggedIn()) {
      this._productsApi.addToCart(+item.productId, newQuantity, item.size.productVariantId)
        .subscribe(response => {
          this.upsertItem(item, +response.item.quantity);
        });
    } else {
      this.upsertItem(item, newQuantity);
      this.persistLocalCart();
    }
  }

  removeFromCart(item: CartItem) {
    const updated = this.cartItems.value.filter(i =>
      !(i.productId === item.productId && i.size.productVariantId === item.size.productVariantId)
    );
    this.cartItems.next(updated);

    if (this._authApi.isLoggedIn()) {
      this._productsApi.removeFromCart(+item.productId,item.size.productVariantId).subscribe();
    } else {
      this.persistLocalCart();
    }
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (this._authApi.isLoggedIn()) {
      this._productsApi.addToCart(+item.productId, quantity, item.size.productVariantId)
        .subscribe(response => {
          this.upsertItem(item, +response.item.quantity);
        });
    } else {
      this.upsertItem(item, quantity);
      this.persistLocalCart();
    }
  }

  private upsertItem(item: CartItem, quantity: number) {
    const items = [...this.cartItems.value];
    const index = items.findIndex(i =>
      i.productId === item.productId && i.size.productVariantId === item.size.productVariantId
    );

    if (index !== -1) {
      items[index].quantity = quantity;
    } else {
      items.push({ ...item, quantity });
    }

    this.cartItems.next(items);
  }

  clearCart() {
    this.cartItems.next([]);
    // if (this._authApi.isLoggedIn()) {
    //   this._productsApi.clearCart().subscribe();
    // } else {
    //   this.persistLocalCart();
    // }
  }
}
