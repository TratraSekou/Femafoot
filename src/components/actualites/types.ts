export type NewsStatus = 'Publié' | 'Brouillon' | 'Programmé' | 'Archivé';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  views: number;
  status: NewsStatus;
  coverImage: string;
  tags: string[];
}

export interface NewsStats {
  published: number;
  drafts: number;
  totalViews: number;
  activeCategories: number;
  publicationsThisWeek: number;
}
