import { Routes } from '@angular/router';
import { ProductListPageComponent } from './features/products/pages/product-list-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ProductListPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
