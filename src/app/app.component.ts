import { Component } from '@angular/core';
import { Category } from './core/interface/category';
import { CategoryService } from './core/services/category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-material-starter-kit-acms';
}
