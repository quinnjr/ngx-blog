import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { WysiwygEditorComponent } from '../../shared/wysiwyg-editor/wysiwyg-editor.component';
import { PostService, CategoryService } from '../../../services';

@Component({
  selector: 'app-post-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FaIconComponent,
    WysiwygEditorComponent,
  ],
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.css'],
})
export class PostEditorComponent {
  postForm: FormGroup;
  isEditMode = signal(false);
  isSaving = signal(false);
  showPreview = signal(false);
  currentDate = new Date();

  private categoryService = inject(CategoryService);
  categories = this.categoryService.allCategories;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private postService: PostService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      slug: ['', [Validators.required]],
      content: ['', [Validators.required]],
      excerpt: [''],
      featuredImage: [''],
      status: ['draft'],
      categoryIds: [[]],
      tags: [''],
      seoTitle: [''],
      seoDescription: [''],
      seoKeywords: [''],
    });

    // Auto-generate slug from title
    this.postForm.get('title')?.valueChanges.subscribe((title) => {
      if (!this.isEditMode() && title) {
        const slug = this.generateSlug(title);
        this.postForm.patchValue({ slug }, { emitEvent: false });
      }
    });

    // Load post if editing
    const postId = this.route.snapshot.paramMap.get('id');
    if (postId) {
      this.loadPost(postId);
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private loadPost(id: string): void {
    const post = this.postService.getPostById(id);
    if (post) {
      this.isEditMode.set(true);
      this.postForm.patchValue({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        status: post.status,
        categoryIds: post.categories.map((c: any) => c.id),
        tags: post.tags.map((t: any) => t.name).join(', '),
        seoTitle: post.seo?.metaTitle || '',
        seoDescription: post.seo?.metaDescription || '',
        seoKeywords: post.seo?.metaKeywords?.join(', ') || '',
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);

    try {
      const formValue = this.postForm.value;

      // Parse tags
      const tags = formValue.tags
        .split(',')
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0)
        .map((name: string) => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
          slug: this.generateSlug(name),
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

      // Get selected categories
      const selectedCategories = this.categories()
        .filter((c: any) => formValue.categoryIds.includes(c.id));

      const postData = {
        id: this.isEditMode() ? this.route.snapshot.paramMap.get('id')! : Math.random().toString(36).substr(2, 9),
        title: formValue.title,
        slug: formValue.slug,
        content: formValue.content,
        excerpt: formValue.excerpt || this.generateExcerpt(formValue.content),
        featuredImage: formValue.featuredImage,
        status: formValue.status,
        visibility: 'public' as const,
        publishedAt: formValue.status === 'published' ? new Date() : undefined,
        authorId: 'default-author',
        author: {
          id: 'default-author',
          name: 'Admin',
          email: 'admin@example.com',
          bio: '',
          avatar: '',
          social: {},
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        categories: selectedCategories,
        tags,
        seo: {
          metaTitle: formValue.seoTitle || formValue.title,
          metaDescription: formValue.seoDescription || formValue.excerpt,
          metaKeywords: formValue.seoKeywords.split(',').map((k: string) => k.trim()).filter((k: string) => k),
          ogTitle: formValue.seoTitle || formValue.title,
          ogDescription: formValue.seoDescription || formValue.excerpt,
          ogImage: formValue.featuredImage,
        },
        views: 0,
        commentsEnabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      if (this.isEditMode()) {
        this.postService.updatePost(postData.id, postData);
      } else {
        this.postService.createPost(postData);
      }

      await this.router.navigate(['/admin/posts']);
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  private generateExcerpt(content: string): string {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return text.length > 160 ? text.substring(0, 157) + '...' : text;
  }

  onCancel(): void {
    this.router.navigate(['/admin/posts']);
  }

  togglePreview(): void {
    this.showPreview.update(v => !v);
  }

  saveDraft(): void {
    this.postForm.patchValue({ status: 'draft' });
    this.onSubmit();
  }

  publish(): void {
    this.postForm.patchValue({ status: 'published' });
    this.onSubmit();
  }
}
