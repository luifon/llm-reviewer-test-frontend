import {
  Component,
  EventEmitter,
  Output,
  inject,
  signal,
  effect,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../../core/models/category.model';
import { CategoryService } from '../../../../core/services/category.service';

@Component({
  selector: 'app-product-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './product-filters.component.html',
  styleUrls: ['./product-filters.component.scss'],
})
export class ProductFiltersComponent {
  private categoryService = inject(CategoryService);

  categories = signal<Category[]>([]);

  @Input({ required: true }) form!: FormGroup;

  constructor() {
    this.categoryService
      .findAll()
      .subscribe((categories) => this.categories.set(categories));
  }
}
