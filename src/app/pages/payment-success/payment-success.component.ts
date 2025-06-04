import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSuccessComponent { }
