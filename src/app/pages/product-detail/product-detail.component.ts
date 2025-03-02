import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product, ProductSize, Image } from '../../interfaces/product.interface';
import { ProductsApiService } from '../../services/products-api.service';




@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
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

  selectedImage!: Image | null;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  quantity: number = 1;
  Math = Math;
  isInWishlist: boolean = false;

  constructor(
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute,
    private productApi: ProductsApiService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = parseInt(params['id']);
      if (this.wishlistService.isInWishlist(productId)) {
        this.isInWishlist = true;
      }
      this.getProduct(productId);
    })
   
  }

  getProduct(productId: number) {
    this.productApi.getProductById(productId).subscribe((product:any) => {
      this.product = product;
      if (this.product.sizes) {
        this.product.general_images = this.product.sizes[0].images;
        this.selectedImage = this.product.general_images[0];
        this.selectedSize = this.product.sizes[0].size;
        this.product.price = this.product.sizes[0].price;
        this.product.stock_quantity = this.product.sizes[0].stock_quantity;
        this.product.dimensions = this.product.sizes[0].dimensions;
        this.product.weight = this.product.sizes[0].weight;
        this.product.material = this.product.sizes[0].material;
      }
    });
  }

  addToCart() {
    this.cartService.addToCart({
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      image: this.product.general_images[0].image_link,
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

  toggleWishlist() {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist({
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        image: this.product.general_images[0].image_link,
        category: this.product.category.name,
        rating: 69,
        reviews: 100
      });
    }
    this.isInWishlist = !this.isInWishlist;
  }

  changeSizeOfProduct(size: ProductSize) {
    this.selectedSize = size.size
    this.product.price = size.price;
    this.product.stock_quantity = size.stock_quantity;
    this.product.general_images = size.images;
    this.selectedImage = this.product.general_images[0];
    this.product.dimensions = size.dimensions;
    this.product.weight = size.weight;
    this.product.material = size.material;
  }
}
