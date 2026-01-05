import { Category } from './category.model';
import { Tag } from './tag.model';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: Author;
  categories: Category[];
  tags: Tag[];
  status: PostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  seo: SEOMetadata;
  views: number;
  likes: number;
  comments: Comment[];
  customFields?: Record<string, any>;
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: Date;
  parentId?: string;
  replies?: Comment[];
}

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  SCHEDULED = 'scheduled',
  ARCHIVED = 'archived'
}

export interface SEOMetadata {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: any;
}
