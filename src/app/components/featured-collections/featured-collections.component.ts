import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-featured-collections',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-white">
      <div class="container">
        <h2 class="section-title">Featured Collections</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let collection of collections" 
               class="relative overflow-hidden rounded-lg group cursor-pointer">
            <img [src]="collection.image" 
                 [alt]="collection.name"
                 class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"/>
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 class="text-white text-2xl font-bold">{{collection.name}}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class FeaturedCollectionsComponent {
  collections = [
    {
      name: 'Handmade Crafts',
      image: 'https://images.unsplash.com/photo-1516981442399-a91139e20ff8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      name: 'Apparel',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
      name: 'Home Decor',
      image: 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
  ];
}