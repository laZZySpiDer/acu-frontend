import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'shop',
    loadComponent: () => 
      import('./pages/shop/shop.component').then(m => m.ShopComponent)
  },{
    path: 'experience',
    loadComponent: () => 
      import('./pages/experience/experience.component').then(m => m.ExperienceComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => 
      import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'order-confirmation/:transactionId',
    loadComponent: () =>
      import('./pages/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent)
  },
    {
    path: 'payment-success',
    loadComponent: () =>
      import('./pages/payment-success/payment-success.component').then(m => m.PaymentSuccessComponent)
  },
  {
    path: 'payment-failure',
    loadComponent: () =>
      import('./pages/payment-failure/payment-failure.component').then(m => m.PaymentFailureComponent)
  },
  {
    path: 'payment-pending/:id',
    loadComponent: () =>
      import('./pages/payment-pending/payment-pending.component').then(m => m.PaymentPendingComponent)
  },
  {
    path: 'order-confirmation',
    loadComponent: () =>
      import('./pages/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent)
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent)
  },
  {
    path: 'track-order',
    loadComponent: () =>
      import('./pages/track-order/track-order.component').then(m => m.TrackOrderComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
];