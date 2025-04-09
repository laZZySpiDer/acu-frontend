import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product, ProductSize, Image } from '../../interfaces/product.interface';
import { ProductsApiService } from '../../services/products-api.service';
import { AuthService} from '../../services/auth.service';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';
import { Review, ReviewsService } from '../../services/review.service';
import { UserLoginResponse } from '../../interfaces/user.interface';




@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule,ReviewFormComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  selectedImage!: Image | null;
  selectedColor: string | null = null;
  selectedSize: string | null = null;
  quantity: number = 1;
  Math = Math;
  isInWishlist: boolean = false;
  currentUser: UserLoginResponse | null = null;
  reviews: Review[] = [];

  constructor(
    private router: Router,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private productApi: ProductsApiService,
    private reviewsService: ReviewsService
  ) {}


  ngOnInit() {
    this.route.params.subscribe(params => {
      const productId = parseInt(params['id']);
      if (this.wishlistService.isInWishlist(productId)) {
        this.isInWishlist = true;
      }
      this.getProduct(productId);
    })
   
    // this.currentUser = this.authService.getCurrentUser();
    this.currentUser = null;
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

      this.loadReviews();
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

  onReviewSubmitted(review: {rating: number, comment: string}) {
    if (!this.currentUser) return;

    const newReview = {
      productId: this.product.id,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
      rating: review.rating,
      comment: review.comment
    };

    this.reviewsService.addReview(newReview)
      .subscribe(() => {
        this.loadReviews();
      });
  }

  loadReviews() {
    this.reviewsService.getProductReviews(this.product.id)
      .subscribe(reviews => {
        this.reviews = reviews;
        console.log(reviews);
      });
  }

  markHelpful(review: Review) {
    this.reviewsService.markHelpful(review.id, this.product.id)
      .subscribe(() => {
        this.loadReviews();
      });
  }

}
