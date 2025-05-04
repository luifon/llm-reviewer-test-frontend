import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductFiltersComponent } from '../components/product-filters/product-filters.component';
import { ProductTableComponent } from '../components/product-table/product-table.component';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [CommonModule, ProductFiltersComponent, ProductTableComponent],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
})
export class ProductListPageComponent {
  private fb = inject(FormBuilder);

  filters: FormGroup = this.fb.group({
    name: [''],
    available: [null],
    categoryId: [null],
  });
}
