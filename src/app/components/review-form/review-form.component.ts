import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ProductsApiService } from "../../services/products-api.service";
import { Router } from "@angular/router";
import { NotificationService } from "../../services/notification.service";

@Component({
  selector: "app-review-form",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./review-form.component.html",
  styleUrl: "./review-form.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent {
  @Input() productId!: number;
  @Output() submitted = new EventEmitter<{ rating: number; comment: string }>();

  rating: number = 0;
  comment: string = "";
  isSubmitting: boolean = false;

  constructor(
    private _productsApiService: ProductsApiService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  get isValid(): boolean {
    return this.rating > 0 && this.comment.trim().length > 0;
  }

  submitReview() {
    if (this.isValid && !this.isSubmitting) {
      this.isSubmitting = true;


      console.log("Review submitted:", {
        rating: this.rating,
        comment: this.comment.trim(),
        productId: this.productId,
      });

      this._productsApiService
        .addProductReview(
          this.productId.toString(),
          this.rating,
          this.comment.trim()
        )
        .subscribe({
          next: (response) => {
            console.log("Review successfully sent to server:", response);
            this.submitted.emit({ rating: this.rating, comment: this.comment });
            this.rating = 0;
            this.comment = "";
            this.isSubmitting = false;
            this.notificationService.success('Review submitted successfully');

          },
          error: (error) => {
            console.error("Error submitting review to server:", error);
            this.notificationService.error('Failed to submit review');
          },
        });
      // Reset form
      setTimeout(() => {
        this.rating = 0;
        this.comment = "";
        this.isSubmitting = false;
      }, 500);
    }
  }
}
