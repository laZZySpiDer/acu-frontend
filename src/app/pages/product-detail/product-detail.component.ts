import { AfterViewInit, Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductsApiService } from '../../services/products-api.service';
import { AuthService } from '../../services/auth.service';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';
import { Review, ReviewsService } from '../../services/review.service';
import { UserLoginResponse } from '../../interfaces/user.interface';
import { ProductSize } from '../../interfaces/cart/cart.model';
import { Product, Image } from '../../interfaces/products/product.interface';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../services/notification.service';




@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewFormComponent, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product!: Product;
  selectedImage!: Image | null;
  selectedColor: string | null = null;
  selectedSize!: ProductSize;
  quantity: number = 1;
  Math = Math;
  isInWishlist: boolean = false;
  currentUser: UserLoginResponse | null = null;
  reviews: Review[] = [];
  variantId: number | null = null;
  private authSubscription: Subscription | null = null;

  quantityDropdownValuesForDolls = [
    { value: 1, label: 'Single Doll' },
    { value: 2, label: 'Couple Dolls' },
    { value: 3, label: 'Family Set of 3' },
    { value: 4, label: 'Family Set of 4' },
    { value: 5, label: 'Family Set of 5' },
  ];
  constructor(
    public router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private productApi: ProductsApiService,
    private reviewsService: ReviewsService,
    private notificationService: NotificationService
  ) { }


  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = parseInt(params['id']);

      if (params['variantId']) {
        const variantId = parseInt(params['variantId']);

        this.variantId = variantId;

      }
      if (this.wishlistService.isInWishlist(productId)) {
        this.isInWishlist = true;
      }
      this.getProduct(productId);
    })

    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  getProduct(productId: number) {
    this.productApi.getProductById(productId).subscribe((product: any) => {
      this.product = product;
      if (this.product.sizes) {
        let index = 0;
        if (this.variantId) {
          const variantSize = this.product.sizes.find(size => size.productVariantId === this.variantId);

          index = this.product.sizes.indexOf(variantSize!);

        }
        this.product.generalImages = this.product.sizes[index].images;
        this.selectedImage = this.product.generalImages[index];
        this.selectedSize = this.product.sizes[index];
        this.product.price = this.product.sizes[index].price.toString();
        this.product.salePrice = this.product.sizes[index].salePrice;
        this.product.stockQuantity = this.product.sizes[index].stockQuantity.toString();
        this.product.dimensions = this.product.sizes[index].dimensions;
        this.product.weight = this.product.sizes[index].weight.toString();
        this.product.material = this.product.sizes[index].material;
      }
      console.log(this.product);
      this.loadReviews();
    });
  }

  selectedCustomImage: string | null = null;
  uploadedImageKey: string | null = null;
  isUploadingImage: boolean = false;

  quantityChange(event: Event) {
    this.quantity = +(event.target as HTMLInputElement).value;
  }

  get requiresPhoto(): boolean {
    // TODO: Define the actual logic for which categories require a photo.
    // For now, let's assume any category with 'Custom' or 'Personalized' in the name,
    // or specific IDs if known.
    if (!this.product || !this.product.category) return false;
    const name = this.product.category.name.toLowerCase();
    return name.includes('custom') || name.includes('personalized') || name.includes('dolls');
    // return false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image (PNG, JPG, JPEG)');
        event.target.value = ''; // Clear the input
        this.selectedCustomImage = null;
        this.uploadedImageKey = null;
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedCustomImage = e.target.result;
      };
      reader.readAsDataURL(file);

      // Upload to API
      this.isUploadingImage = true;
      this.productApi.uploadTempImage(file).subscribe({
        next: (response: any) => {
          this.uploadedImageKey = response.key;
          this.isUploadingImage = false;
          console.log('Image uploaded successfully, key:', this.uploadedImageKey);
        },
        error: (err) => {
          console.error('Image upload failed', err);
          alert('Failed to upload image. Please try again.');
          this.isUploadingImage = false;
          this.selectedCustomImage = null;
          this.uploadedImageKey = null;
          event.target.value = '';
        }
      });
    }
  }

  removeImage() {
    this.selectedCustomImage = null;
    this.uploadedImageKey = null;
    this.isUploadingImage = false;
  }

  addToCart() {
    if (!this.selectedSize) {
      alert('Please select a size');
      return;
    }

    if (this.requiresPhoto) {
      if (!this.currentUser) {
        alert('Please login to upload a photo for this product.');
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        return;
      }
      if (!this.selectedCustomImage) {
        alert('Please upload a photo for this product before adding to cart.');
        return;
      }
      if (this.isUploadingImage) {
        alert('Please wait for the image to finish uploading.');
        return;
      }
      if (!this.uploadedImageKey) {
        alert('Image upload failed or incomplete. Please try uploading again.');
        return;
      }
    }

    const finalPrice = this.product.salePrice ?? +this.product.price;

    this.cartService.addToCart({
      productId: `${this.product.id}`,
      productName: this.product.name,
      price: finalPrice,
      originalPrice: this.product.salePrice ? +this.product.price : undefined,
      mainImageLink: this.product.generalImages[0],
      quantity: +this.quantity,
      size: this.selectedSize,
      category: this.product.category.name,
      categoryId: this.product.category.id,
      // customImage: this.selectedCustomImage || undefined,
      customImageName: this.uploadedImageKey || undefined
    });
  }

  buyNow() {
    if (!this.selectedSize) {
      alert('Please select a size');
      return;
    }

    if (this.requiresPhoto) {
      if (!this.currentUser) {
        alert('Please login to upload a photo for this product.');
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
        return;
      }
      if (!this.selectedCustomImage) {
        alert('Please upload a photo for this product before adding to cart.');
        return;
      }
      if (this.isUploadingImage) {
        alert('Please wait for the image to finish uploading.');
        return;
      }
      if (!this.uploadedImageKey) {
        alert('Image upload failed or incomplete. Please try uploading again.');
        return;
      }
    }

    this.addToCart();
    this.router.navigate(['/checkout']);
    // TODO: Implement redirect to checkout
  }

  toggleWishlist() {
    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product.id);
    }
    this.isInWishlist = !this.isInWishlist;
  }

  changeSizeOfProduct(size: ProductSize) {
    this.selectedSize = size
    this.product.price = size.price.toString();
    this.product.salePrice = size.salePrice;
    this.product.stockQuantity = size.stockQuantity.toString();
    this.product.generalImages = size.images;
    this.selectedImage = this.product.generalImages[0];
    this.product.dimensions = size.dimensions;
    this.product.weight = size.weight.toString();
    this.product.material = size.material;
  }

  onReviewSubmitted(review: { rating: number, comment: string }) {
    if (!this.currentUser) return;

    const newReview: Review = {
      id: '0',
      productId: this.product.id,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date()
    };

    this.product.comments = [newReview, ...(this.product.comments || [])];
    this.product.ratingsCount = (this.product.ratingsCount || 0) + 1;
    this.product.averageRating = +(((this.product.averageRating || 0) * (this.product.ratingsCount - 1) + review.rating) / this.product.ratingsCount).toFixed(1);
    // this.reviewsService.addReview(newReview)
    //   .subscribe(() => {
    //     this.loadReviews();
    //   });
  }

  loadReviews() {
    this.reviewsService.getProductReviews(this.product.id)
      .subscribe(reviews => {
        this.reviews = reviews;
        console.log(reviews);
      });
  }


  // Lightbox methods
  isLightboxOpen: boolean = false;
  currentLightboxIndex: number = 0;

  openLightbox(index: number) {
    this.currentLightboxIndex = index;
    this.isLightboxOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  closeLightbox() {
    this.isLightboxOpen = false;
    document.body.style.overflow = ''; // Restore scrolling
  }

  nextLightboxImage() {
    if (this.product && this.product.generalImages) {
      this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.product.generalImages.length;
    }
  }

  prevLightboxImage() {
    if (this.product && this.product.generalImages) {
      this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.product.generalImages.length) % this.product.generalImages.length;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.isLightboxOpen) return;

    if (event.key === 'Escape') {
      this.closeLightbox();
    } else if (event.key === 'ArrowRight') {
      this.nextLightboxImage();
    } else if (event.key === 'ArrowLeft') {
      this.prevLightboxImage();
    }
  }

  isDescriptionExpanded: boolean = false;

  toggleDescription() {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
  }
}
