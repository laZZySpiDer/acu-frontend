

import { Category } from "./category.interface";



export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  created_at: string;
  updated_at: string;
  category_id: string;
  generalImages: Image[];
  sizes: ProductSize[];
  category: Category;
  rating: number;
  reviews: number;
  dimensions: string;
  weight: number;
  material: string;
  mainImageLink: Image;
}

export interface Image {
  id: number;
  imageLink: string;
  imageName: string;
}

export interface ProductSize {
  size: string;
  price: number;
  salePrice?: number;
  images: Image[];
  stockQuantity: number;
  dimensions: string;
  weight: number;
  material: string;
  productVariantId: number;
}

// export interface Category {
//   id: number;
//   name: string;
// }
