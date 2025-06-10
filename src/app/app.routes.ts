import { Routes } from '@angular/router';
import { ProductListPageComponent } from './features/products/pages/product-list-page.component';
import { TaskListComponent } from './components/task-list/task-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tasks',
    pathMatch: 'full',
  },
  {
    path: 'tasks',
    component: TaskListComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
