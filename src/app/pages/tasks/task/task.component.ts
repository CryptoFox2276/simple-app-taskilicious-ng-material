import { Component, OnInit } from "@angular/core";
import { Category } from "src/app/core/interface/category";
import { TASK } from "src/app/core/interface/task";
import { CategoryService } from "src/app/core/services/category.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TaskService } from "src/app/core/services/task.service";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { TreeGridMatchingRecordsOnlyFilteringStrategy } from "igniteui-angular";

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.scss"],
})
export class TaskComponent implements OnInit {
  title: String = "Create Task";
  task: TASK;
  categories: Category[] = [];
  taskForm: FormGroup;
  isNew:boolean = true;
  task_id: number = -1;

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
  ) {
    this.taskForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      categoryId: [null, Validators.required],
    });

    this.task = {
      name: "",
      categoryId: -1,
      id: -1,
      teamMemberIds: [],
    };
  }

  ngOnInit(): void {
    
    this.getCategories();
    this.getTask();
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  getTask() {
    const id = Number(this.route.snapshot.paramMap.has('id')?this.route.snapshot.paramMap.get('id'):0);
    this.task_id = id;
    if(id > 0) {
      this.taskService.getTask(id).subscribe(res => {
        this.taskForm.setValue({
          name: res.name,
          categoryId: res.categoryId,
        });
        this.isNew = false;
        this.title = "Edit Task";
      })
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      if(this.isNew) {
        this.taskService.addTask(this.taskForm.value).subscribe(res => {
          console.log('Successfully created.', res);
          window.location.href = (`/categories/` + this.taskForm.value.categoryId);
        });
      } else {
        this.taskService.updateTask(this.task_id, this.taskForm.value).subscribe(res => {
          console.log('Successfully updated.', res);
          window.location.href = (`/categories/` + this.taskForm.value.categoryId);
        });
      }
    }
  }
}
