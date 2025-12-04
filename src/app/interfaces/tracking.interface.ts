export interface OrderStatus {
  status: 'In Progress' | 'shipped' | 'out-for-delivery' | 'Delivered';
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
  allowUploads: boolean;
  additionalImages?: string[];
  items: Array<{
    itemName: string;
    quantity: number;
    itemImage: string;
    variantSize?: string;
    customImageUrl?: string;
  }>;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    method?: string; // Optional shipping method
  };
}