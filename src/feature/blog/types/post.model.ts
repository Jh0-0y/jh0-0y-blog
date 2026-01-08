import type { PostCategory, PostStatus } from './post.enums';

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  category: PostCategory;
  date: string;
  readTime: string;
  tags: string[];
  content?: string | null;
  status?: PostStatus;
  createdAt?: string;
  updatedAt?: string;
}