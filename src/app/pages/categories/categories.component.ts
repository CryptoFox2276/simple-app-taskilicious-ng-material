import { Component, OnInit } from '@angular/core';
import { faCoffee, faPencilRuler, faPen } from '@fortawesome/free-solid-svg-icons';
import { Category } from 'src/app/core/interface/category';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];
  faCoffee = faCoffee;
  faPencil = faPen;

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories():void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  onSort(direction:Number) {
    if(direction > 0) {
      // soring a-z
      this.categories.sort((a, b) => {
        if(a.name > b.name) return 1;
        if(a.name < b.name) return -1;
        else return 0
      });
    } else {
      // sorting z-a
      this.categories.sort((a, b) => {
        if(a.name < b.name) return 1;
        if(a.name > b.name) return -1;
        else return 0
      });
    }
  }
}
