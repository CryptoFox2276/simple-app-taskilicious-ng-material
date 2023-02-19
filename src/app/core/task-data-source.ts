import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";
import { TASK } from "./interface/task";
import { TaskService } from "./services/task.service";

export class TaskDataSource implements DataSource<TASK> {
  private taskSubject = new BehaviorSubject<TASK[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private taskService: TaskService) {}

  connect(collectionViewer: CollectionViewer): Observable<readonly TASK[]> {
    // throw new Error("Method not implemented.");
    return this.taskSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    // throw new Error("Method not implemented.");
    this.taskSubject.complete();
    this.loadingSubject.complete();
  }

  loadTasks(id: number) {
    this.loadingSubject.next(true);

    this.taskService.getTasks().subscribe((res) => {
      const filteredRes = res.filter((item) => {
        return Number(item.categoryId) === id;
      });
      this.taskSubject.next(filteredRes);
      this.loadingSubject.next(false);
    });
  }
}
