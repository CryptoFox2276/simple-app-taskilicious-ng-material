import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../interface/category';
import { MOCKCATEGORIES } from './mock_data';
import { delay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiURL = 'https://63761992b5f0e1eb850298da.mockapi.io'

  categories: Category[] = [];

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiURL}/categories`).pipe(
      delay(500)
      );
    // return MOCKCATEGORIES;
  }
}
