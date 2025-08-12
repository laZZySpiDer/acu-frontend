import { ProductSize } from "../interfaces/cart/cart.model";
import { Image } from "./products/product.interface";

export interface OrderDetails {
    orderId: string;
    shippingAddress: {
      firstName: string;
      lastName: string;
      address: string;
      apartment?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    shippingMethod: string;
    estimatedDelivery: string;
    items: Array<{
      productName: string;
      price: number;
      quantity: number;
      mainImageLink: Image;
      color?: string;
      size?: ProductSize;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    userId?: string;
  }