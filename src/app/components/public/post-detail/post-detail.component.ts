import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostService } from '../../../services/post.service';
import { SEOService } from '../../../services/seo.service';
import { Post } from '../../../models';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private postService = inject(PostService);
  private seoService = inject(SEOService);

  post = signal<Post | null>(null);
  relatedPosts = signal<Post[]>([]);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const post = this.postService.getPostBySlug(slug);
      
      if (post) {
        this.post.set(post);
        this.postService.incrementViews(post.id);
        
        // Update SEO meta tags
        this.seoService.updateTags(post.seo, `/post/${post.slug}`);
        
        // Add structured data for blog post
        const structuredData = this.seoService.generateBlogPostStructuredData(
          post.title,
          post.excerpt,
          { name: post.author.name, url: `/author/${post.author.id}` },
          post.publishedAt!,
          post.updatedAt,
          post.featuredImage,
          `/post/${post.slug}`
        );
        
        post.seo.structuredData = structuredData;
        this.seoService.updateTags(post.seo, `/post/${post.slug}`);
        
        // Load related posts
        if (post.categories.length > 0) {
          const related = this.postService.getPostsByCategory(post.categories[0].id)
            .filter(p => p.id !== post.id)
            .slice(0, 3);
          this.relatedPosts.set(related);
        }
      }
    });
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }

  likePost() {
    const post = this.post();
    if (post) {
      this.postService.incrementLikes(post.id);
      const updated = this.postService.getPostById(post.id);
      if (updated) {
        this.post.set(updated);
      }
    }
  }
}
