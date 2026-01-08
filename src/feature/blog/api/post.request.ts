import type { PostCategory, PostStatus } from '../types/post.enums';

export interface CreatePostRequest {
  title: string;
  excerpt: string;
  category: PostCategory;
  content: string;
  status?: PostStatus;
  tags?: string[];
}

export interface UpdatePostRequest {
  title: string;
  excerpt: string;
  category: PostCategory;
  content: string;
  status?: PostStatus;
  tags?: string[];
}
