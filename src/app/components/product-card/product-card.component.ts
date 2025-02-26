import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'  
})
export class ProductCardComponent {

  @Input() product: any;
  constructor(private router: Router) {}
  openProductPage(product: any) {
    this.router.navigate(['/product', 1]);
  }
 }
