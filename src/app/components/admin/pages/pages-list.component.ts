import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageService } from '../../../services/page.service';

@Component({
  selector: 'app-pages-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pages-list.component.html',
  styleUrls: ['./pages-list.component.css']
})
export class PagesListComponent {
  private pageService = inject(PageService);
  
  pages = this.pageService.allPages;

  deletePage(id: string) {
    if (confirm('Are you sure you want to delete this page?')) {
      this.pageService.deletePage(id);
    }
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
}
