export interface OrderStatus {
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered';
  timestamp: Date;
  location?: string;
  description: string;
}

export interface TrackingDetails {
  orderId: string;
  trackingNumber: string;
  estimatedDelivery: string;
  currentStatus: OrderStatus['status'];
  statusHistory: OrderStatus[];
  items: Array<{
    name: string;
    quantity: number;
    image: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}