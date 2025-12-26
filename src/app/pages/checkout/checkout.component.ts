import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { take } from 'rxjs';
import { OrderDetails } from '../../interfaces/order.interface';
import { ProductsApiService } from '../../services/products-api.service';
import { AuthApiService } from '../../services/auth-api.service';
import { AuthService } from '../../services/auth.service';
import { CouponService, CouponValidationResponse } from '../../services/coupon.service';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  @ViewChild('checkoutForm') checkoutForm!: NgForm;
  cartItems$ = this.cartService.cartItems$;
  cartTotal$ = this.cartService.cartTotal$;

  shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 100,
      estimatedDays: '7-10 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 180,
      estimatedDays: '4-6 business days'
    }
  ];

  selectedShippingMethod: string = 'standard';

  formData = {
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'IN',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(private cartService: CartService, private orderService: OrderService, private router: Router, private _productsApi: ProductsApiService,
    private _auth: AuthService, private couponService: CouponService, @Inject(PLATFORM_ID) private platformId: Object) { }

  // Gifting properties
  isGiftPackagingSelected: boolean = false;
  GIFT_PACKAGING_FEE: number = 30;

  // Coupon properties
  isCouponInputVisible = false;
  couponCode = '';
  discountAmount = 0;
  isCouponApplied = false;
  couponError = '';

  getSelectedShippingPrice(): number {
    const method = this.shippingMethods.find(m => m.id === this.selectedShippingMethod);
    return method ? method.price : 0;
  }

  calculateTax(): number {
    // Simplified tax calculation (8.5%)
    // return (this.cartService.getCartTotal() * 0.12);
    return Math.round(this.cartService.getCartTotal() * 0.12);
  }

  calculateTotal(): number {
    let total = this.cartService.getCartTotal() + this.getSelectedShippingPrice() + this.calculateTax() - this.discountAmount;
    if (this.isGiftPackagingSelected) {
      total += this.GIFT_PACKAGING_FEE;
    }
    return total > 0 ? total : 0;
  }

  toggleCouponInput() {
    this.isCouponInputVisible = !this.isCouponInputVisible;
    if (!this.isCouponInputVisible) {
      this.couponError = '';
    }
  }

  applyCoupon() {
    if (!this.couponCode.trim()) return;

    console.log('Validating coupon:', this.couponCode, 'Cart Total:', this.cartService.getCartTotal());

    this.couponService.validateCoupon(this.couponCode, this.cartService.getCartTotal())
      .subscribe({
        next: (response: any) => {
          console.log('Coupon validation response:', response);

          // Handle potentially nested response data
          const data = response.data || response;

          if (data.isValid || data.valid) {

            if (data.coupon && data.coupon.discountPercentage) {
              const cartTotal = this.cartService.getCartTotal();
              this.discountAmount = (cartTotal * data.coupon.discountPercentage) / 100;
            } else {
              // Fallback for previous expected formats
              let discount = data.discountAmount || data.discount || 0;
              if (!discount && data.newTotal !== undefined) {
                discount = this.cartService.getCartTotal() - data.newTotal;
              }
              this.discountAmount = Number(discount);
            }

            this.isCouponApplied = true;
            this.couponError = '';
            console.log('Coupon applied. Discount:', this.discountAmount);
          } else {
            this.couponError = data.message || 'Invalid coupon code';
            this.isCouponApplied = false;
            this.discountAmount = 0;
          }
        },
        error: (err) => {
          console.error('Coupon validation error:', err);
          this.couponError = err.error?.message || 'Error validating coupon';
          this.isCouponApplied = false;
          this.discountAmount = 0;
        }
      });
  }

  removeCoupon() {
    this.couponCode = '';
    this.discountAmount = 0;
    this.isCouponApplied = false;
    this.couponError = '';
    this.isCouponInputVisible = false;
  }

  placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.form.markAllAsTouched();
      alert('Please fill in all required fields correctly.');
      return;
    }

    // TODO: Implement order placement logic
    // console.log('Order placed:', {
    //   items: this.cartItems$.subscribe(items => items),
    //   shipping: this.getSelectedShippingPrice(),
    //   tax: this.calculateTax(),
    //   total: this.calculateTotal(),
    //   shippingMethod: this.selectedShippingMethod,
    //   ...this.formData
    // });

    // Clear cart
    // this.cartService.clearCart();
    let order: OrderDetails = {
      items: [],
      shipping: this.getSelectedShippingPrice(),
      tax: this.calculateTax(),
      total: this.calculateTotal(),
      shippingMethod: this.selectedShippingMethod,
      orderId: '',
      shippingAddress: {
        ...this.formData
      },
      estimatedDelivery: '',
      subtotal: 0,
      userId: this._auth.getCurrentUser()?.id,
      couponCode: this.isCouponApplied ? this.couponCode : undefined,
      discountAmount: this.isCouponApplied ? this.discountAmount : 0,
      giftPackaging: this.isGiftPackagingSelected,
      giftPackagingFee: this.isGiftPackagingSelected ? this.GIFT_PACKAGING_FEE : 0
    }
    this.cartItems$.pipe(take(1)).subscribe(items => order.items = items)
    this.orderService.setOrderDetails(order);

    console.log('Order Details:', this.orderService.getOrderDetails());

    this._productsApi.initiatePayment(order).subscribe((response: any) => {
      console.log('Payment Response : ', response)
      this.cartService.clearCart();
      // window.location.href = response.payment_url;
      if (isPlatformBrowser(this.platformId)) {
        window.location.href = response.data.instrumentResponse.redirectInfo.url;
      }
    });

    // this.router.navigate(['/order-confirmation']);
    // TODO: Redirect to order confirmation page
    // alert('Order placed successfully!');
  }
}