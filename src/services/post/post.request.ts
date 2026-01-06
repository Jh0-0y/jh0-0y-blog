import type { PostCategory, PostStatus } from "@/domains/blog/types";

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
