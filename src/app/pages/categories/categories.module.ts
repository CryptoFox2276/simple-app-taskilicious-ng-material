import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CategoriesComponent } from './categories.component';
import { CategoryComponent } from './category/category.component';
import { DetailComponent } from './detail/detail.component';




const routes: Routes = [
  {
    path: '',
    component: CategoriesComponent
  },
  {
    path: 'create',
    component: CategoryComponent,
  },
  {
    path: 'edit/:id',
    component: CategoryComponent,
  },
  {
    path: ':id',
    component: DetailComponent,
  }
]

@NgModule({
  declarations: [
    CategoriesComponent,
    CategoryComponent,
    DetailComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,

    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,

    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [],
})
export class CategoriesModule { }
