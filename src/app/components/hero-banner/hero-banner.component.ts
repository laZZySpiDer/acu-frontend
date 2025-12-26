import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hero-banner.component.html',
})
export class HeroBannerComponent implements OnInit, AfterViewInit {
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    // Swiper initialization will go here
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.heroVideo && this.heroVideo.nativeElement) {
        this.heroVideo.nativeElement.muted = true;
        this.heroVideo.nativeElement.play().catch(error => {
          // console.log('Video play failed:', error);
        });
      }
    }
  }
}