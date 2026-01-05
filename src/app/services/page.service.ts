import { Injectable, signal, computed } from '@angular/core';
import { Page, PageStatus, PageTemplate } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  private pages = signal<Page[]>([]);

  public allPages = computed(() => this.pages());
  public publishedPages = computed(() =>
    this.pages().filter(p => p.status === PageStatus.PUBLISHED)
  );

  constructor() {
    // Pages will be loaded from API
  }

  /**
   * Get all pages
   */
  getPages(): Page[] {
    return this.pages();
  }

  /**
   * Get published pages
   */
  getPublishedPages(): Page[] {
    return this.publishedPages();
  }

  /**
   * Get page by slug
   */
  getPageBySlug(slug: string): Page | null {
    return this.pages().find(p => p.slug === slug) || null;
  }

  /**
   * Get page by ID
   */
  getPageById(id: string): Page | null {
    return this.pages().find(p => p.id === id) || null;
  }

  /**
   * Get child pages
   */
  getChildPages(parentId: string): Page[] {
    return this.pages().filter(p => p.parentId === parentId);
  }

  /**
   * Create a new page
   */
  createPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Page {
    const newPage: Page = {
      ...page,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.pages.update(pages => [...pages, newPage]);
    this.savePages();
    return newPage;
  }

  /**
   * Update a page
   */
  updatePage(id: string, updates: Partial<Page>): Page | null {
    const index = this.pages().findIndex(p => p.id === id);
    if (index === -1) return null;

    const updatedPage = {
      ...this.pages()[index],
      ...updates,
      updatedAt: new Date()
    };

    this.pages.update(pages => {
      const newPages = [...pages];
      newPages[index] = updatedPage;
      return newPages;
    });

    this.savePages();
    return updatedPage;
  }

  /**
   * Delete a page
   */
  deletePage(id: string): boolean {
    const index = this.pages().findIndex(p => p.id === id);
    if (index === -1) return false;

    this.pages.update(pages => pages.filter(p => p.id !== id));
    this.savePages();
    return true;
  }

  /**
   * Save pages to localStorage
   */
  private savePages(): void {
    localStorage.setItem('blog-pages', JSON.stringify(this.pages()));
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `page-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

}
