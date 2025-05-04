import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductFiltersComponent } from '../components/product-filters/product-filters.component';
import { ProductTableComponent } from '../components/product-table/product-table.component';
import { ProductFormModalComponent } from '../components/product-modal/product-form-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [
    CommonModule,
    ProductFiltersComponent,
    ProductTableComponent,
    MatButtonModule,
  ],
  templateUrl: './product-list-page.component.html',
  styleUrl: './product-list-page.component.scss',
})
export class ProductListPageComponent {
  private fb = inject(FormBuilder);

  constructor(private dialog: MatDialog) {}

  filters: FormGroup = this.fb.group({
    name: [''],
    available: [null],
    categoryId: [null],
  });

  openAddModal() {
    this.dialog
      .open(ProductFormModalComponent)
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.filters.setValue({ ...this.filters.value });
        }
      });
  }
}
