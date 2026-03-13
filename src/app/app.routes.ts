import { Routes } from '@angular/router';
import { authGuard } from './features/auth/auth.guard';
import { LayoutComponent } from './features/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },

      {
        path: 'home',
        loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-search.component').then(
            (m) => m.ProductSearchComponent,
          ),
      },

      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/order.component').then((m) => m.OrderComponent),
      },
      {
        path: 'orders/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/orders/order-detail/order-detail').then(
            (m) => m.OrderDetailComponent,
          ),
      },
    ],
  },
];
