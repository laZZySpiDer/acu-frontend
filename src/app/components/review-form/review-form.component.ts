import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './review-form.component.html',
  styleUrl: './review-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewFormComponent {
  @Input() productId!: number;
  @Output() submitted = new EventEmitter<{rating: number, comment: string}>();

  rating: number = 0;
  comment: string = '';
  isSubmitting: boolean = false;

  get isValid(): boolean {
    return this.rating > 0 && this.comment.trim().length > 0;
  }

  submitReview() {
    if (this.isValid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitted.emit({
        rating: this.rating,
        comment: this.comment.trim()
      });

      // Reset form
      setTimeout(() => {
        this.rating = 0;
        this.comment = '';
        this.isSubmitting = false;
      }, 500);
    }
  }
}
