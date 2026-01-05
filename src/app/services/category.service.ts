import { Injectable, signal, computed } from '@angular/core';
import { Category } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categories = signal<Category[]>([]);

  public allCategories = computed(() => this.categories());

  constructor() {
    // Categories will be loaded from API
  }

  /**
   * Get all categories
   */
  getCategories(): Category[] {
    return this.categories();
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: string): Category | null {
    return this.categories().find(c => c.id === id) || null;
  }

  /**
   * Get category by slug
   */
  getCategoryBySlug(slug: string): Category | null {
    return this.categories().find(c => c.slug === slug) || null;
  }

  /**
   * Get child categories
   */
  getChildCategories(parentId: string): Category[] {
    return this.categories().filter(c => c.parentId === parentId);
  }

  /**
   * Create a new category
   */
  createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'postCount'>): Category {
    const newCategory: Category = {
      ...category,
      id: this.generateId(),
      postCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.categories.update(cats => [...cats, newCategory]);
    this.saveCategories();
    return newCategory;
  }

  /**
   * Update a category
   */
  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const index = this.categories().findIndex(c => c.id === id);
    if (index === -1) return null;

    const updatedCategory = {
      ...this.categories()[index],
      ...updates,
      updatedAt: new Date()
    };

    this.categories.update(cats => {
      const newCats = [...cats];
      newCats[index] = updatedCategory;
      return newCats;
    });

    this.saveCategories();
    return updatedCategory;
  }

  /**
   * Delete a category
   */
  deleteCategory(id: string): boolean {
    const index = this.categories().findIndex(c => c.id === id);
    if (index === -1) return false;

    this.categories.update(cats => cats.filter(c => c.id !== id));
    this.saveCategories();
    return true;
  }

  /**
   * Save categories to localStorage
   */
  private saveCategories(): void {
    localStorage.setItem('blog-categories', JSON.stringify(this.categories()));
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `cat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

}
