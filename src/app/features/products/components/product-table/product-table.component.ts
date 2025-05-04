import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormGroup } from '@angular/forms';
import { Product } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product.service';
import { catchError, finalize, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ProductFormModalComponent } from '../product-modal/product-form-modal.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnChanges, AfterViewInit {
  @Input({ required: true }) filters!: FormGroup;

  displayedColumns = ['name', 'price', 'available', 'category', 'actions'];
  dataSource = new MatTableDataSource<Product>();
  totalItems = signal(0);

  // actualSort = { active: 'name', direction: 'asc' };

  pageIndex = 0;
  pageSize = 10;
  defaultSortColumn: string = 'name';
  @ViewChild(MatSort) sort!: MatSort;
  loading: boolean = false;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService
  ) {}

  ngOnChanges(): void {
    this.pageIndex = 0;
    this.loadData();
    this.listenToFilters();
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  onSortChange($e: any) {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    const { name, available, categoryId } = this.filters.value;

    // Use the MatSort properties directly
    const sortActive = this.sort?.active || this.defaultSortColumn;
    const sortDirection = this.sort?.direction || 'asc';

    this.productService
      .findByFilters({
        name,
        available,
        categoryId,
        page: this.pageIndex,
        size: this.pageSize,
        sort: `${sortActive},${sortDirection}`,
      })
      .pipe(
        catchError(() => {
          this.dataSource.data = [];
          this.totalItems.set(0);
          return of({
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: 0,
            size: 0,
          });
        }),
        finalize(() => (this.loading = false))
      )
      .subscribe((page) => {
        this.dataSource.data = page.content;
        this.totalItems.set(page.totalElements);
      });
  }

  private destroyRef = inject(DestroyRef);
  private listenToFilters() {
    this.filters.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadData();
      });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  editProduct(productId: string) {
    this.productService.findById(productId).subscribe((product) => {
      this.dialog
        .open(ProductFormModalComponent, {
          data: product,
          height: '70%',
        })
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            this.filters.setValue({ ...this.filters.value });
          }
        });
    });
  }
}
