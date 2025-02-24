import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { HeroBannerComponent } from '../../components/hero-banner/hero-banner.component';
import { FeaturedCollectionsComponent } from '../../components/featured-collections/featured-collections.component';
import { TrendingProductsComponent } from '../../components/trending-products/trending-products.component';
import { CustomerReviewsComponent } from '../../components/customer-reviews/customer-reviews.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroBannerComponent,
    FeaturedCollectionsComponent,
    TrendingProductsComponent,
    CustomerReviewsComponent,
    NewsletterComponent,
    FooterComponent
  ],
  template: `
    <app-header></app-header>
    <main>
      <app-hero-banner></app-hero-banner>
      <app-featured-collections></app-featured-collections>
      <app-trending-products></app-trending-products>
      <app-customer-reviews></app-customer-reviews>
      <app-newsletter></app-newsletter>
    </main>
    <app-footer></app-footer>
  `
})
export class HomeComponent {}