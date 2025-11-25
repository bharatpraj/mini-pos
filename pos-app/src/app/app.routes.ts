import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pos',
    pathMatch: 'full'  
  },

  {
    path: 'pos',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/pos/pos.component').then(m => m.PosComponent)
  },

  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
  },

  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  }
];
