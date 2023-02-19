import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Category } from 'src/app/core/interface/category';
import { CategoryService } from 'src/app/core/services/category.service';

@Component({
  selector: 'app-cagetory',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  category: Category;
  title: String = "Edit Category";
  faArrowLeft = faArrowLeft;

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private location: Location,
  ) { 
    this.category = {
      name: '',
      id: -1
    }
  }

  ngOnInit(): void {
    this.getCategory();
  }

  getCategory(): void {
    const id = Number(this.route.snapshot.paramMap.has('id')?this.route.snapshot.paramMap.get('id'):0);
    if(id > 0) {
      this.categoryService.getCategory(id).subscribe(cat => this.category = cat);
    } else {
      this.title = "Create Category";
    }
  }

  onSubmit(): void {
    if(this.category.id < 0) {
      this.categoryService.addCategory(this.category.name).subscribe((res) => {
        this.back();
      });
    } else {
      this.categoryService.updateCategory(this.category).subscribe(cat => {
        this.back();
      });
    }
  }
  
  back() {
    this.location.back();
  }

}
