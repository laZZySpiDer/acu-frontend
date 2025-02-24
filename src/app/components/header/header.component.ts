import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-md fixed w-full top-0 z-50">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-20">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <h1 class="text-2xl font-bold text-primary">EcoStore</h1>
          </div>

          <!-- Search Bar -->
          <div class="hidden md:block flex-1 max-w-xl mx-8">
            <div class="relative">
              <input
                type="text"
                placeholder="Search products..."
                class="w-full px-4 py-2 rounded-full border focus:outline-none focus:border-primary"
              />
              <button class="absolute right-3 top-2">
                <i class="fas fa-search text-gray-400"></i>
              </button>
            </div>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-6">
            <a href="/" class="text-gray-700 hover:text-primary">Home</a>
            <a href="/shop" class="text-gray-700 hover:text-primary">Shop</a>
            <a href="/new-arrivals" class="text-gray-700 hover:text-primary">New Arrivals</a>
            <a href="/best-sellers" class="text-gray-700 hover:text-primary">Best Sellers</a>
            <a href="/workshops" class="text-gray-700 hover:text-primary">Workshops</a>
            <a href="/contact" class="text-gray-700 hover:text-primary">Contact</a>
          </nav>

          <!-- User Icons -->
          <div class="flex items-center space-x-4">
            <button class="text-gray-700 hover:text-primary">
              <i class="fas fa-user"></i>
            </button>
            <button class="text-gray-700 hover:text-primary">
              <i class="fas fa-heart"></i>
            </button>
            <button class="text-gray-700 hover:text-primary relative">
              <i class="fas fa-shopping-cart"></i>
              <span class="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                0
              </span>
            </button>
          </div>

          <!-- Mobile Menu Button -->
          <button class="md:hidden text-gray-700">
            <i class="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}