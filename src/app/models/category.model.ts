export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  color?: string;
  icon?: string;
  order: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
  seo?: any; // SEOMetadata - avoid circular dependency
  children?: Category[];
}
