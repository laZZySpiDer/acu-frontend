import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative h-[600px] mt-20">
      <div class="swiper-container h-full">
        <!-- Carousel implementation will go here -->
        <div class="relative h-full bg-gray-100">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <h2 class="text-4xl md:text-6xl font-bold text-primary mb-4">
                Handcrafted with Love
              </h2>
              <p class="text-xl text-gray-600 mb-8">
                Discover unique artisan products made just for you
              </p>
              <button class="btn-primary">Shop Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroBannerComponent implements OnInit {
  ngOnInit() {
    // Swiper initialization will go here
  }
}