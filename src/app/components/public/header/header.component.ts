import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CategoryService } from '../../../services/category.service';
import { PageService } from '../../../services/page.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FontAwesomeModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  private categoryService = inject(CategoryService);
  private pageService = inject(PageService);
  
  mobileMenuOpen = signal(false);
  
  categories = this.categoryService.allCategories;
  pages = this.pageService.publishedPages;

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }
}
