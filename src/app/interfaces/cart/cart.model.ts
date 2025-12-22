import { Image } from '../products/product.interface';

export interface CartItem {
  cartItemId?: string;
  quantity: number;
  productId: string;
  productName: string;
  mainImageLink: Image;
  size: ProductSize;
  price: number;
  originalPrice?: number;
  customImageName?: string;
  category?: string;
  categoryId?: number;
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