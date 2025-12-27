// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map } from 'rxjs';
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
    private notificationService: NotificationService
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
      const saved = localStorage.getItem('cart');
      if (saved) {
        const localItems: CartItem[] = JSON.parse(saved);
        if (localItems.length > 0) {
          // Merge local items to server
          const mergeRequests = localItems.map(item =>
            this._productsApi.addToCart(+item.productId, item.quantity, item.size.productVariantId, item.customImageName)
          );

          forkJoin(mergeRequests).subscribe({
            next: () => {
              localStorage.removeItem('cart'); // Clear local after successful merge
              this.fetchServerCart();
            },
            error: (err) => {
              console.error('Failed to merge cart items:', err);
              this.fetchServerCart(); // Proceed to load server cart anyway
            }
          });
          return;
        }
      }
      this.fetchServerCart();
    } else {
      const saved = localStorage.getItem('cart');
      this.cartItems.next(saved ? JSON.parse(saved) : []);
    }
  }

  private fetchServerCart() {
    this._productsApi.getCart().subscribe({
      next: (res: any) => {
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
      },
      error: (err) => {
        console.error('Failed to load server cart:', err);
      }
    });
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
      localStorage.removeItem('cart');
    }
  }
}
