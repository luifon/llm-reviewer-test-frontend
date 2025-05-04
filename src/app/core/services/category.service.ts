import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = 'http://localhost:8080/categories';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }

  findById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }
}
