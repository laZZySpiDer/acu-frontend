// cart.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, map } from 'rxjs';
// import { CartItem } from '../interfaces/cart.interface';
import { CartItem } from '../interfaces/cart/cart.model';
import { ProductsApiService } from './products-api.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

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
    private _authApi: AuthService,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
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
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('cart', JSON.stringify(this.cartItems.value));
    }
  }

  private loadCartItems() {
    if (this._authApi.isLoggedIn()) {
      this._productsApi.getCart().subscribe((res: any) => {
        console.log('Cart items loaded from API:', res);
        const items: CartItem[] = res.items.map((item: any) => {
          const regularPrice = typeof item.size.price === 'string' ? parseFloat(item.size.price) : item.size.price;
          const salePrice = item.size.salePrice ? (typeof item.size.salePrice === 'string' ? parseFloat(item.size.salePrice) : item.size.salePrice) : null;

          return {
            productId: item.productId,
            quantity: +item.quantity,
            price: salePrice && salePrice > 0 ? salePrice : regularPrice,
            originalPrice: regularPrice,
            productName: item.productName,
            mainImageLink: item.mainImageLink,
            size: item.size,
            customImageName: item.customImageName || item.custom_image_name,
            categoryId: item.categoryId || item.category_id || (item.category ? item.category.id : undefined)
          };
        });
        this.cartItems.next(items);
        console.log('Cart items loaded:', this.cartItems.value);
      });
    } else {
      if (isPlatformBrowser(this.platformId)) {
        const saved = localStorage.getItem('cart');
        this.cartItems.next(saved ? JSON.parse(saved) : []);
      } else {
        this.cartItems.next([]);
      }
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
      this._productsApi.addToCart(+item.productId, newQuantity, item.size.productVariantId, item.customImageName)
        .subscribe(response => {
          this.upsertItem(item, +response.item.quantity);
          this.notificationService.success(`${item.productName} added to cart`);
        });
    } else {
      this.upsertItem(item, newQuantity);
      this.persistLocalCart();
      this.notificationService.success(`${item.productName} added to cart`);
    }
  }

  removeFromCart(item: CartItem) {
    const updated = this.cartItems.value.filter(i =>
      !(i.productId === item.productId && i.size.productVariantId === item.size.productVariantId)
    );
    this.cartItems.next(updated);

    if (this._authApi.isLoggedIn()) {
      this._productsApi.removeFromCart(+item.productId, item.size.productVariantId).subscribe(() => {
        this.notificationService.info(`${item.productName} removed from cart`);
      });
    } else {
      this.persistLocalCart();
      this.notificationService.info(`${item.productName} removed from cart`);
    }
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (this._authApi.isLoggedIn()) {
      this._productsApi.addToCart(+item.productId, quantity, item.size.productVariantId, item.customImageName)
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
    if (this._authApi.isLoggedIn()) {
      this._productsApi.clearCart().subscribe();
    } else {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem('cart');
      }
    }
  }
}
