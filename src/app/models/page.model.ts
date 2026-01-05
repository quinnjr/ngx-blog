import { SEOMetadata } from './post.model';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  template: PageTemplate;
  parentId?: string;
  order: number;
  status: PageStatus;
  featuredImage?: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seo: SEOMetadata;
  customFields?: Record<string, any>;
  children?: Page[];
}

export enum PageStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum PageTemplate {
  DEFAULT = 'default',
  FULL_WIDTH = 'full-width',
  SIDEBAR_LEFT = 'sidebar-left',
  SIDEBAR_RIGHT = 'sidebar-right',
  LANDING = 'landing',
  CONTACT = 'contact',
  ABOUT = 'about',
  CUSTOM = 'custom'
}
