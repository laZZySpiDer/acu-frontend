import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';
import { FeaturedCollectionsComponent } from '../../components/featured-collections/featured-collections.component';
import { TrendingProductsComponent } from '../../components/trending-products/trending-products.component';
import { CustomerReviewsComponent } from '../../components/customer-reviews/customer-reviews.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroBannerComponent,
    FeaturedCollectionsComponent,
    TrendingProductsComponent,
    CustomerReviewsComponent,
    NewsletterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private _cartService: CartService) { }

  ngOnInit(): void {
     
  }


}