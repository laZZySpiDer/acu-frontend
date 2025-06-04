import { ProductSize } from "./product.interface";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size: ProductSize;
}