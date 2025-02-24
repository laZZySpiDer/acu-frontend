import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="bg-gray-800 text-white pt-16 pb-8">
      <div class="container">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="text-xl font-bold mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a href="/about" class="hover:text-primary">About Us</a></li>
              <li><a href="/privacy" class="hover:text-primary">Privacy Policy</a></li>
              <li><a href="/shipping" class="hover:text-primary">Shipping & Returns</a></li>
              <li><a href="/faq" class="hover:text-primary">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Customer Service</h3>
            <ul class="space-y-2">
              <li><a href="/contact" class="hover:text-primary">Contact Us</a></li>
              <li><a href="/track-order" class="hover:text-primary">Track Order</a></li>
              <li><a href="/returns" class="hover:text-primary">Returns</a></li>
              <li><a href="/support" class="hover:text-primary">Support</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Categories</h3>
            <ul class="space-y-2">
              <li><a href="/shop/handmade" class="hover:text-primary">Handmade Crafts</a></li>
              <li><a href="/shop/accessories" class="hover:text-primary">Accessories</a></li>
              <li><a href="/shop/apparel" class="hover:text-primary">Apparel</a></li>
              <li><a href="/shop/home-decor" class="hover:text-primary">Home Decor</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-xl font-bold mb-4">Connect With Us</h3>
            <div class="flex space-x-4 mb-4">
              <a href="#" class="hover:text-primary"><i class="fab fa-facebook-f"></i></a>
              <a href="#" class="hover:text-primary"><i class="fab fa-instagram"></i></a>
              <a href="#" class="hover:text-primary"><i class="fab fa-pinterest-p"></i></a>
              <a href="#" class="hover:text-primary"><i class="fab fa-twitter"></i></a>
            </div>
            <p class="text-sm">Follow us on social media for updates and inspiration</p>
          </div>
        </div>
        <div class="border-t border-gray-700 pt-8 text-center text-sm">
          <p> EcoStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
