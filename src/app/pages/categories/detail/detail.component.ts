import { Location } from "@angular/common";
import { Component, OnInit, SimpleChange } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Category } from "src/app/core/interface/category";
import { CategoryService } from "src/app/core/services/category.service";
import { TaskService } from "src/app/core/services/task.service";
import { TASK } from "src/app/core/interface/task";
import { TaskDataSource } from "src/app/core/task-data-source";

export interface TaskTable {
  name: string,
  id: number,
}

@Component({
  selector: "app-detail",
  templateUrl: "./detail.component.html",
  styleUrls: ["./detail.component.scss"],
})
export class DetailComponent implements OnInit {
  title = "Category Detail";
  faArrowLeft = faArrowLeft;
  displayedColumns: string[] = ["name", "id", "edit", "remove"];

  category: Category;
  tasks: TASK[] = [];
  dataSource:TaskDataSource;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private taskService: TaskService,
    private location: Location,
  ) {
    this.category = {
      id: -1,
      name: "",
    };
    this.dataSource = new TaskDataSource(this.taskService);
    
  }

  async ngOnInit() {
    await this.getCategory();
    await this.getTasks();
  }

  ngOnChange(dataSource:SimpleChange) {
    console.log(dataSource);
  }
  getCategory() {
    const id = Number(
      this.route.snapshot.paramMap.has("id")
        ? this.route.snapshot.paramMap.get("id")
        : 0
    );
    if (id > 0) {
      this.categoryService
        .getCategory(id)
        .subscribe((cat) => (this.category = cat));
    }
  }

  getTasks() {
    const id = Number(
      this.route.snapshot.paramMap.has("id")
        ? this.route.snapshot.paramMap.get("id")
        : 0
    );

    if (id > 0) {
      this.dataSource.loadTasks(id);
    }
  }

  onRemoveTask(task_id: number) {
    this.taskService.removeTask(task_id).subscribe(res => {
      this.getTasks();
    })
  }

  onEditTask(task_id: number) {
    window.location.href = '/tasks/edit/' + task_id;
  }
}
