import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  images: string[];
  inStock: boolean;
  description: string;
  details: {
    material: string;
    dimensions: string;
    weight: string;
  };
  colors?: string[];
  sizes?: string[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product = {
    id: 1,
    name: 'Handwoven Basket',
    price: 49.99,
    rating: 5,
    reviews: 128,
    category: 'Home Decor',
    images: [
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f11?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f12?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f13?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1595408076683-5d0c643e4f14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    ],
    inStock: true,
    description: 'Handcrafted by skilled artisans, this beautiful basket is perfect for storage and decoration. Each piece is unique and made with sustainable materials.',
    details: {
      material: 'Natural Seagrass',
      dimensions: '12" x 12" x 14"',
      weight: '2.5 lbs'
    },
    colors: ['#8B4513', '#D2691E', '#DEB887'],
    sizes: ['Small', 'Medium', 'Large']
  };

  reviews = [
    {
      name: 'Sarah Johnson',
      rating: 5,
      comment: 'Beautiful craftsmanship! The basket is even more stunning in person.',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      date: '2024-02-15'
    },
    {
      name: 'Michael Chen',
      rating: 4,
      comment: 'Great quality and perfect size for my needs. Would buy again.',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      date: '2024-02-10'
    }
  ];

  selectedImage: string = '';
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  quantity: number = 1;
  Math = Math;

  constructor(
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.selectedImage = this.product.images[0];
    if (this.product.colors) {
      this.selectedColor = this.product.colors[0];
    }
    if (this.product.sizes) {
      this.selectedSize = this.product.sizes[0];
    }
  }

  addToCart() {
    this.cartService.addToCart({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      image: this.product.images[0],
      quantity: this.quantity,
      color: this.selectedColor || undefined,
      size: this.selectedSize || undefined
    });
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['/checkout']);
    // TODO: Implement redirect to checkout
  }
}