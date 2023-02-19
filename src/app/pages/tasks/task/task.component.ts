import { Component, OnInit } from "@angular/core";
import { Category } from "src/app/core/interface/category";
import { TASK } from "src/app/core/interface/task";
import { CategoryService } from "src/app/core/services/category.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { TaskService } from "src/app/core/services/task.service";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Team } from "src/app/core/interface/team";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { HttpClient, HttpEventType, HttpResponse } from "@angular/common/http";
import { finalize, Subscription } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
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
  teamMembers: Team[] = [];
  teamMemberIds: number[] = [];

  taskForm: FormGroup;
  isNew: boolean = true;
  task_id: number = -1;

  file: File;
  fileName: string;
  fileUrl: any;
  requiredFileType: string;
  uploadProgress: number;
  uploadSub: Subscription;

  uploadApiUrl: string = "https://upload.uploadcare.com/base/";
  fileServerUrl: string = "https://ucarecdn.com/";

  constructor(
    private categoryService: CategoryService,
    private taskService: TaskService,
    private formBuilder: FormBuilder,
    private location: Location,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackbar: MatSnackBar
  ) {
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      categoryId: ['', Validators.required],
    });

    this.task = {
      name: "",
      categoryId: -1,
      id: -1,
      teamMemberIds: [],
    };

    this.requiredFileType = "image/png, image/gif, image/jpeg";
    this.uploadSub = Subscription.EMPTY;
    this.uploadProgress = 0;
    this.fileName = "";
    this.fileUrl = "";
    this.file = {} as File;
  }

  ngOnInit(): void {
    this.getCategories();
    this.getTask();
    this.getTeamMembers();
  }

  getCategories() {
    this.categoryService
      .getCategories()
      .subscribe((categories) => (this.categories = categories));
  }

  getTask() {
    const id = Number(
      this.route.snapshot.paramMap.has("id")
        ? this.route.snapshot.paramMap.get("id")
        : 0
    );
    this.task_id = id;
    if (id > 0) {
      this.taskService.getTask(id).subscribe((res) => {
        console.log(res);
        this.taskForm.setValue({
          name: res.name,
          categoryId: res.categoryId,
        });
        this.teamMemberIds = res.teamMemberIds ? res.teamMemberIds : [];
        this.isNew = false;
        this.title = "Edit Task";
        this.fileUrl = res.imageUrl;
      });
    }
  }

  getTeamMembers() {
    this.taskService.getTeamMembers().subscribe((res) => {
      this.teamMembers = res;
    });
  }

  onCheckMember(ob: MatCheckboxChange, member_id: number) {
    if (ob.checked) {
      this.teamMemberIds.push(member_id);
    } else {
      const index = this.teamMemberIds.indexOf(member_id);
      if (index > -1) {
        this.teamMemberIds.splice(index, 1);
      }
    }
  }

  onCheckStatus(member_id: number) {
    const index = this.teamMemberIds.indexOf(member_id);
    if (index > -1) return true;
    else return false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {

      this.fileName = file.name;
      const reader = new FileReader();

      reader.onload = (e) => {
        console.log(e);
        this.fileUrl = reader.result
      };

      reader.readAsDataURL(file);

      this.file = file;
    }
  }

  onFileUpload(callback?: Function) {
    if (this.file) {
      this.fileName = this.file.name;
      const formData = new FormData();

      formData.append("file", this.file);
      formData.append("UPLOADCARE_PUB_KEY", "6cd30c4148197c56ece0");
      formData.append("UPLOADCARE_STORE", "1");

      const upload$ = this.http
        .post(this.uploadApiUrl, formData, {
          reportProgress: true,
          observe: "events",
          responseType: "json",
        })
        .pipe(finalize(() => this.reset));

      this.uploadSub = upload$.subscribe((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = event.total
            ? Math.round(100 * (event.loaded / event.total))
            : 0;
        } else if (event instanceof HttpResponse) {
          const { file } = event.body as any;
          this.fileUrl = this.fileServerUrl + file + "/";

          if (callback) callback();
        }
      });
    }
  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = 0;
    this.uploadSub = Subscription.EMPTY;
    this.fileName = "";
  }

  showMessage(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 3500,
    });
  }

  onSubmit() {
    if (this.taskForm.valid) {
      this.task = {
        name: this.taskForm.value.name,
        categoryId: this.taskForm.value.categoryId,
        id: this.task_id,
        teamMemberIds: this.teamMemberIds,
      };
      if (this.isNew) {
        if(this.fileUrl) {
          this.onFileUpload(() => {
            this.task.imageUrl = this.fileUrl;
            delete this.task.id;
            this.taskService.addTask(this.task).subscribe((res) => {
              console.log("Successfully created.", res);
              window.location.href =
                `/categories/` + this.taskForm.value.categoryId;
            });
          });
        } else {
          delete this.task.id;
            this.taskService.addTask(this.task).subscribe((res) => {
              console.log("Successfully created.", res);
              window.location.href =
                `/categories/` + this.taskForm.value.categoryId;
            });
        }
      } else {
        if(this.fileUrl) {
          this.onFileUpload(() => {
            this.task.imageUrl = this.fileUrl;
            this.taskService.updateTask(this.task).subscribe((res) => {
              console.log("Successfully updated.", res);
              window.location.href =
                `/categories/` + this.taskForm.value.categoryId;
            });
          });
        } else {
          this.taskService.updateTask(this.task).subscribe((res) => {
            console.log("Successfully updated.", res);
            window.location.href =
              `/categories/` + this.taskForm.value.categoryId;
          });
        }
      }
    } else {
      this.showMessage("Validation Error", "Error");
    }
  }
}
