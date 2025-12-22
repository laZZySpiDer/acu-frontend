import { Review } from "../../services/review.service";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  salePrice?: number;
  stockQuantity: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  material: string | null;
  weight: string | null;
  dimensions: string | null;
  mainImageLink: Image;
  generalImages: Image[];
  sizes: ProductSize[];
  category: ProductCategory;
  comments?: Review[];
  averageRating?: number;
  ratingsCount?: number;
}

export interface ProductSize {
  size: string;
  price: number;
  salePrice?: number;
  images: Image[];
  weight: number;
  material: string;
  dimensions: string;
  stockQuantity: number;
  productVariantId: number;
}

export interface Image {
  id: number;
  imageName: string;
  imageLink: string;
}

export interface ProductCategory {
  id: number;
  name: string;
}
