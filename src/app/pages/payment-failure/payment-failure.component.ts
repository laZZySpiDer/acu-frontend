import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-payment-failure',
  standalone: true,
  imports: [],
  templateUrl: './payment-failure.component.html',
  styleUrl: './payment-failure.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentFailureComponent { }
