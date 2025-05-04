import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';
import { Page } from '../models/page.model';

export interface ProductFilterParams {
  name?: string;
  available?: boolean;
  categoryId?: string;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly baseUrl = 'http://localhost:8080/products';

  constructor(private http: HttpClient) {}

  findByFilters(params: ProductFilterParams): Observable<Page<Product>> {
    let httpParams = new HttpParams();

    if (params.name) httpParams = httpParams.set('name', params.name);
    if (params.available !== null && params.available !== undefined)
      httpParams = httpParams.set('available', params.available);
    if (params.categoryId)
      httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.page !== undefined)
      httpParams = httpParams.set('page', params.page);
    if (params.size !== undefined)
      httpParams = httpParams.set('size', params.size);
    if (params.sort) httpParams = httpParams.set('sort', params.sort);

    return this.http.get<Page<Product>>(this.baseUrl, { params: httpParams });
  }

  findById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  delete(id: string): Observable<Product> {
    return this.http.delete<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(id: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }
}
