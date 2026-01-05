import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private postService = inject(PostService);
  private categoryService = inject(CategoryService);

  featuredPosts = computed(() => this.postService.getRecentPosts(3));
  recentPosts = computed(() => this.postService.getRecentPosts(6));
  categories = this.categoryService.allCategories;

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  truncateText(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  }
}
