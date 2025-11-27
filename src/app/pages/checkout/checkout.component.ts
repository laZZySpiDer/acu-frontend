import { Component, ViewChild } from '@angular/core';
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
    private _auth: AuthService) { }

  getSelectedShippingPrice(): number {
    const method = this.shippingMethods.find(m => m.id === this.selectedShippingMethod);
    return method ? method.price : 0;
  }

  calculateTax(): number {
    // Simplified tax calculation (8.5%)
    return (this.cartService.getCartTotal() * 0.12);
  }

  calculateTotal(): number {
    return this.cartService.getCartTotal() + this.getSelectedShippingPrice() + this.calculateTax();
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
      userId: this._auth.getCurrentUser()?.id
    }
    this.cartItems$.pipe(take(1)).subscribe(items => order.items = items)
    this.orderService.setOrderDetails(order);

    console.log('Order Details:', this.orderService.getOrderDetails());

    this._productsApi.initiatePayment(order).subscribe((response: any) => {
      console.log('Payment Response : ', response)
      this.cartService.clearCart();
      // window.location.href = response.payment_url;
      window.location.href = response.data.instrumentResponse.redirectInfo.url;
    });

    // this.router.navigate(['/order-confirmation']);
    // TODO: Redirect to order confirmation page
    // alert('Order placed successfully!');
  }
}