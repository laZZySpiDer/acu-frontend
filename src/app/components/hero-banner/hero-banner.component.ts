import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './hero-banner.component.html',
})
export class HeroBannerComponent implements OnInit {
  ngOnInit() {
    // Swiper initialization will go here
  }
}