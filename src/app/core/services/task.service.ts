import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Category } from "../interface/category";
import { TASK } from "../interface/task";
import { Team } from "../interface/team";
import { MOCKCATEGORIES } from "./mock_data";
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
export class TaskService {
  apiURL = "https://63761992b5f0e1eb850298da.mockapi.io";

  categories: Category[] = [];

  constructor(private http: HttpClient, private snackbar: MatSnackBar) {}

  getTasks(): Observable<TASK[]> {
    return this.http.get<TASK[]>(`${this.apiURL}/tasks`).pipe(
      delay(500),
      tap((_) => console.log(`fetched tasks`)),
      catchError(this.handleError<TASK[]>(`getTasks Error`))
    );
  }

  getTask(task_id: Number): Observable<TASK> {
    return this.http.get<TASK>(`${this.apiURL}/tasks/${task_id}`).pipe(
      tap((_) => console.log(`fetched task id=${task_id}`)),
      catchError(this.handleError<TASK>(`getCategory id=${task_id}`))
    );
  }

  addTask(newTask: any) {
    return this.http
      .post<TASK>(`${this.apiURL}/tasks`, newTask, httpOptions)
      .pipe(catchError(this.handleError("addTask", newTask)));
  }

  updateTask(updatedTask: TASK) {
    return this.http
      .put<TASK>(`${this.apiURL}/tasks/${updatedTask.id}`, updatedTask, httpOptions)
      .pipe(catchError(this.handleError("addTask", updatedTask)));
  }

  removeTask(task_id: number) {
    return this.http
      .delete<TASK>(`${this.apiURL}/tasks/${task_id}`, httpOptions)
      .pipe(catchError(this.handleError("removeTask", task_id)));
  }

  getTeamMembers() {
    return this.http.get<Team[]>(`${this.apiURL}/team-members`).pipe(
      delay(500),
      tap((_) => console.log(`fetched tasks`)),
      catchError(this.handleError<Team[]>(`getTasks Error`))
    );
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${error.message}`);
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
