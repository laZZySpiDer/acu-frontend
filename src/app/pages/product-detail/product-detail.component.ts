import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { ProductsApiService } from '../../services/products-api.service';
import { AuthService} from '../../services/auth.service';
import { ReviewFormComponent } from '../../components/review-form/review-form.component';
import { Review, ReviewsService } from '../../services/review.service';
import { UserLoginResponse } from '../../interfaces/user.interface';
import { ProductSize } from '../../interfaces/cart/cart.model';
import { Product, Image } from '../../interfaces/products/product.interface';




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
  selectedSize!: ProductSize;
  quantity: number = 1;
  Math = Math;
  isInWishlist: boolean = false;
  currentUser: UserLoginResponse | null = null;
  reviews: Review[] = [];

  quantityDropdownValuesForDolls = [
    {value: 1, label: 'Single Doll'},
    {value: 2, label: 'Couple Dolls'},
    {value: 3, label: 'Family Set of 3'},
    {value: 4, label: 'Family Set of 4'},
    {value: 5, label: 'Family Set of 5'},
  ];
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
   
    this.currentUser = this.authService.getCurrentUser();
    // this.currentUser = null;
  }

  getProduct(productId: number) {
    this.productApi.getProductById(productId).subscribe((product:any) => {
      this.product = product;
      if (this.product.sizes) {
        this.product.generalImages = this.product.sizes[0].images;
        this.selectedImage = this.product.generalImages[0];
        this.selectedSize = this.product.sizes[0];
        this.product.price = this.product.sizes[0].price.toString();
        this.product.stockQuantity = this.product.sizes[0].stockQuantity.toString();
        this.product.dimensions = this.product.sizes[0].dimensions;
        this.product.weight = this.product.sizes[0].weight.toString();
        this.product.material = this.product.sizes[0].material;
      }
      console.log(this.product);
      this.loadReviews();
    });
  }

  quantityChange(event: Event) {
    this.quantity = +(event.target as HTMLInputElement).value;
  }

  addToCart() {
    this.cartService.addToCart({
      productId: `${this.product.id}`,
      productName: this.product.name,
      price: +this.product.price,
      mainImageLink: this.product.generalImages[0],
      quantity: +this.quantity,
      size: this.selectedSize
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
        price: +this.product.price,
        image: this.product.generalImages[0].imageLink,
        category: this.product.category.name,
        rating: 69,
        reviews: 100
      });
    }
    this.isInWishlist = !this.isInWishlist;
  }

  changeSizeOfProduct(size: ProductSize) {
    this.selectedSize = size
    this.product.price = size.price.toString();
    this.product.stockQuantity = size.stockQuantity.toString();
    this.product.generalImages = size.images;
    this.selectedImage = this.product.generalImages[0];
    this.product.dimensions = size.dimensions;
    this.product.weight = size.weight.toString();
    this.product.material = size.material;
  }

  onReviewSubmitted(review: {rating: number, comment: string}) {
    if (!this.currentUser) return;

    const newReview : Review = {
      id: '0',
      productId: this.product.id,
      userId: this.currentUser.id,
      userName: this.currentUser.name,
      userAvatar: this.currentUser.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date()
    };

    this.product.comments = [ newReview, ...(this.product.comments || []) ];
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



}
