import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';
import { OrderDetails, OrderService } from '../../services/order.service';
import { take } from 'rxjs';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  cartItems$ = this.cartService.cartItems$;
  cartTotal$ = this.cartService.cartTotal$;

  shippingMethods: ShippingMethod[] = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 5.99,
      estimatedDays: '5-7 business days'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 14.99,
      estimatedDays: '2-3 business days'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 29.99,
      estimatedDays: 'Next business day'
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
    country: 'US',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(private cartService: CartService,private orderService: OrderService, private router: Router) {}

  getSelectedShippingPrice(): number {
    const method = this.shippingMethods.find(m => m.id === this.selectedShippingMethod);
    return method ? method.price : 0;
  }

  calculateTax(): number {
    // Simplified tax calculation (8.5%)
    return (this.cartService.getCartTotal() * 0.085);
  }

  calculateTotal(): number {
    return this.cartService.getCartTotal() + this.getSelectedShippingPrice() + this.calculateTax();
  }

  placeOrder() {
    // TODO: Implement order placement logic
    console.log('Order placed:', {
      items: this.cartItems$,
      shipping: this.getSelectedShippingPrice(),
      tax: this.calculateTax(),
      total: this.calculateTotal(),
      shippingMethod: this.selectedShippingMethod,
      ...this.formData
    });

    // Clear cart
    this.cartService.clearCart();
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
      subtotal: 100
    }
    this.cartItems$.pipe(take(1)).subscribe(items => order.items = items)
    this.orderService.setOrderDetails(order);
    this.router.navigate(['/order-confirmation']);
    // TODO: Redirect to order confirmation page
    alert('Order placed successfully!');
  }
}