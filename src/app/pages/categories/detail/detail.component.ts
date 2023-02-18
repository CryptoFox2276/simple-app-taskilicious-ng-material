import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Category } from "src/app/core/interface/category";
import { CategoryService } from "src/app/core/services/category.service";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { TASK } from "src/app/core/interface/task";

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
  displayedColumns: string[] = ["name", "id"];

  category: Category;
  tasks: TASK[] = [];
  dataSource:TaskTable[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private location: Location
  ) {
    this.category = {
      id: -1,
      name: "",
    };
  }

  ngOnInit(): void {
    this.getCategory();
    this.getTasks();
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
      this.categoryService.getTasks().subscribe((res) => {
        this.tasks = res;
        console.log(res);
        console.log(typeof id);
        console.log(typeof Number(res[0].categoryId));
        const filteredRes = res.filter((item) => {
          return Number(item.categoryId) === id;
        });
        console.log(filteredRes);
        filteredRes.map((item) => {
          return this.dataSource.push({
            name: item.name,
            id: item.categoryId,
          });
        });
      });
    }
  }
}
