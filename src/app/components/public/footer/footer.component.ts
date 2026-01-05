import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { PageService } from '../../../services/page.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  private categoryService = inject(CategoryService);
  private pageService = inject(PageService);
  
  categories = this.categoryService.allCategories;
  pages = this.pageService.publishedPages;
  currentYear = new Date().getFullYear();
}
