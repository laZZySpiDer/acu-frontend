import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { OrderService} from '../../services/order.service';
import { OrderDetails } from '../../interfaces/order.interface';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.component.html'
})
export class OrderConfirmationComponent implements OnInit {
  orderDetails$ = this.orderService.orderDetails$;
  orderDetails!:OrderDetails;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {

    const transactionId = this.activatedRoute.snapshot.params['transactionId'];
    console.log('Transaction ID:', transactionId);
    if(!transactionId){
      this.router.navigate(['/']);
    }else{
      this.getOrderDetails(transactionId);
    }
  }


  getOrderDetails(transactionId: string) {
    this.orderService.getOrderDetailsByTransactionId(transactionId).subscribe({
      next: (res:OrderDetails) => {
        console.log('Order details fetched:', res);
        this.orderDetails = res
        this.orderService.setOrderDetails(res);
      },
      error: (error) => {
        console.error('Error fetching order details:', error);
        this.router.navigate(['/']);
      }
    });
  }

  trackOrder() {
    this.router.navigate(['/track-order']);
  }

  ngOnDestroy() {
    // Clear order details when leaving the page
    this.orderService.clearOrderDetails();
  }
}