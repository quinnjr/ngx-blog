import { Injectable, signal, computed } from '@angular/core';
import { Post, PostStatus } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts = signal<Post[]>([]);

  public allPosts = computed(() => this.posts());
  public publishedPosts = computed(() =>
    this.posts().filter(p => p.status === PostStatus.PUBLISHED)
  );
  public draftPosts = computed(() =>
    this.posts().filter(p => p.status === PostStatus.DRAFT)
  );

  constructor() {
    // Posts will be loaded from API
  }

  /**
   * Get all posts
   */
  getPosts(): Post[] {
    return this.posts();
  }

  /**
   * Get published posts only
   */
  getPublishedPosts(): Post[] {
    return this.publishedPosts();
  }

  /**
   * Get post by slug
   */
  getPostBySlug(slug: string): Post | null {
    return this.posts().find(p => p.slug === slug) || null;
  }

  /**
   * Get post by ID
   */
  getPostById(id: string): Post | null {
    return this.posts().find(p => p.id === id) || null;
  }

  /**
   * Get posts by category
   */
  getPostsByCategory(categoryId: string): Post[] {
    return this.posts().filter(p =>
      p.categories.some(c => c.id === categoryId)
    );
  }

  /**
   * Get posts by tag
   */
  getPostsByTag(tagId: string): Post[] {
    return this.posts().filter(p =>
      p.tags.some(t => t.id === tagId)
    );
  }

  /**
   * Get posts by author
   */
  getPostsByAuthor(authorId: string): Post[] {
    return this.posts().filter(p => p.author.id === authorId);
  }

  /**
   * Search posts
   */
  searchPosts(query: string): Post[] {
    const lowerQuery = query.toLowerCase();
    return this.posts().filter(p =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.content.toLowerCase().includes(lowerQuery) ||
      p.excerpt.toLowerCase().includes(lowerQuery) ||
      p.tags.some(t => t.name.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get recent posts
   */
  getRecentPosts(limit: number = 5): Post[] {
    return this.publishedPosts()
      .sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime())
      .slice(0, limit);
  }

  /**
   * Get popular posts (by views)
   */
  getPopularPosts(limit: number = 5): Post[] {
    return this.publishedPosts()
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);
  }

  /**
   * Create a new post
   */
  createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes' | 'comments'>): Post {
    const newPost: Post = {
      ...post,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
      likes: 0,
      comments: []
    };

    this.posts.update(posts => [...posts, newPost]);
    this.savePosts();
    return newPost;
  }

  /**
   * Update an existing post
   */
  updatePost(id: string, updates: Partial<Post>): Post | null {
    const index = this.posts().findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedPost = {
      ...this.posts()[index],
      ...updates,
      updatedAt: new Date()
    };

    this.posts.update(posts => {
      const newPosts = [...posts];
      newPosts[index] = updatedPost;
      return newPosts;
    });

    this.savePosts();
    return updatedPost;
  }

  /**
   * Delete a post
   */
  deletePost(id: string): boolean {
    const index = this.posts().findIndex(p => p.id === id);
    if (index === -1) return false;

    this.posts.update(posts => posts.filter(p => p.id !== id));
    this.savePosts();
    return true;
  }

  /**
   * Increment post views
   */
  incrementViews(id: string): void {
    const post = this.getPostById(id);
    if (post) {
      this.updatePost(id, { views: post.views + 1 });
    }
  }

  /**
   * Increment post likes
   */
  incrementLikes(id: string): void {
    const post = this.getPostById(id);
    if (post) {
      this.updatePost(id, { likes: post.likes + 1 });
    }
  }

  /**
   * Save posts to localStorage
   */
  private savePosts(): void {
    localStorage.setItem('blog-posts', JSON.stringify(this.posts()));
  }


  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `post-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

}
