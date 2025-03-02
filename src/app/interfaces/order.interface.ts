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
      name: string;
      price: number;
      quantity: number;
      image: string;
      color?: string;
      size?: string;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  }