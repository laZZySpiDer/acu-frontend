import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-scroll-to-top',
    standalone: true,
    imports: [CommonModule],
    template: `
    <button
      *ngIf="showButton"
      (click)="scrollToTop()"
      class="fixed bottom-8 right-8 bg-primary text-white w-12 h-12 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 z-50 flex items-center justify-center hover-lift animate-fade-in"
      aria-label="Scroll to top"
    >
      <i class="fas fa-arrow-up"></i>
    </button>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class ScrollToTopComponent {
    showButton = false;

    constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object) { }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (isPlatformBrowser(this.platformId)) {
            if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 300) {
                this.showButton = true;
            } else if (this.showButton && (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 300)) {
                this.showButton = false;
            }
        }
    }

    scrollToTop() {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}
