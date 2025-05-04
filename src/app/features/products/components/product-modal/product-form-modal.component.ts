import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Category } from '../../../../core/models/category.model';
import { ProductById } from '../../../../core/models/product.model';
import { CategoryService } from '../../../../core/services/category.service';
import { ProductService } from '../../../../core/services/product.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-product-form-modal',
  templateUrl: './product-form-modal.component.html',
  styleUrl: './product-form-modal.component.scss',
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    CommonModule,
  ],
})
export class ProductFormModalComponent implements OnInit {
  form: FormGroup;
  categories$!: Observable<Category[]>;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<ProductFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: ProductById
  ) {
    this.isEdit = !!data;

    console.log(data);
    this.form = this.fb.group({
      name: [data?.name || '', [Validators.required]],
      description: [data?.description || ''],
      price: [data?.price || 0, [Validators.required, Validators.min(0)]],
      available: [data?.available || false],
      categoryId: [data?.categoryId! || '', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.findAll();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value;

    if (this.isEdit && this.data?.id) {
      this.productService.update(this.data.id, payload).subscribe(() => {
        this.dialogRef.close(true);
      });
    } else {
      this.productService.create(payload).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
