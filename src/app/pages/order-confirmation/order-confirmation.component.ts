import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { OrderService, OrderDetails } from '../../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './order-confirmation.component.html'
})
export class OrderConfirmationComponent implements OnInit {
  orderDetails$ = this.orderService.orderDetails$;
  orderDetails!:OrderDetails;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    // Redirect to home if no order details are available
    this.orderDetails$.subscribe((details:any) => {
      if (!details) {
        this.router.navigate(['/']);
      }else{
        this.orderDetails = details;
      }
    });
  }

  trackOrder() {
    alert('Order tracking will be implemented soon!');
  }

  ngOnDestroy() {
    // Clear order details when leaving the page
    this.orderService.clearOrderDetails();
  }
}