import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Category } from "../interface/category";
import { delay } from "rxjs/operators";
import { Observable, tap, catchError, of } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  apiURL = "https://63761992b5f0e1eb850298da.mockapi.io";

  categories: Category[] = [];

  constructor(private http: HttpClient, private snackbar: MatSnackBar) {}

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(`${this.apiURL}/categories`)
      .pipe(delay(500));
  }

  getCategory(id: Number): Observable<Category> {
    return this.http.get<Category>(`${this.apiURL}/categories/${id}`).pipe(
      tap((_) => console.log(`fetched category id=${id}`)),
      catchError(this.handleError<Category>(`getCategory id=${id}`))
    );
  }

  addCategory(name: String) {
    return this.http
      .post<Category>(`${this.apiURL}/categories`, { name: name }, httpOptions)
      .pipe(catchError(this.handleError("addCategory", name)));
  }

  updateCategory(category: Category): Observable<Category> {
    return this.http
      .put<Category>(
        `${this.apiURL}/categories/${category.id}`,
        category,
        httpOptions
      )
      .pipe(catchError(this.handleError("updateCategory", category)));
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead

      this.log(`${operation} failed: ${error.error}`);

      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.snackbar.open(message, "Error", {
      duration: 3500,
    });
  }
}
