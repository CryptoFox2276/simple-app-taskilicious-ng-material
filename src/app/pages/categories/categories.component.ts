import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/core/interface/category';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories():void {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

}
