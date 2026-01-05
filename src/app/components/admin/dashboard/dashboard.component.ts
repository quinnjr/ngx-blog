import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { PageService } from '../../../services/page.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent {
  private postService = inject(PostService);
  private pageService = inject(PageService);
  private categoryService = inject(CategoryService);

  stats = computed(() => {
    const posts = this.postService.allPosts();
    const publishedPosts = this.postService.publishedPosts();
    const draftPosts = this.postService.draftPosts();
    const pages = this.pageService.allPages();

    return {
      totalPosts: posts.length,
      publishedPosts: publishedPosts.length,
      draftPosts: draftPosts.length,
      totalPages: pages.length
    };
  });

  recentPosts = computed(() => {
    return this.postService.getRecentPosts(5);
  });

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
}
