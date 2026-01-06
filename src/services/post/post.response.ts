import type { PostCategory, PostStatus } from "@/domains/blog/types";

export interface PostListItem {
  id: number;
  title: string;
  excerpt: string;
  category: PostCategory;
  status: PostStatus;
  tags: string[];
  createdAt: string;
}

export interface PostDetail {
  id: number;
  title: string;
  excerpt: string;
  category: PostCategory;
  content: string;
  status: PostStatus;
  tags: string[];
  prev: AdjacentPost | null;
  next: AdjacentPost | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdjacentPost {
  id: number;
  title: string;
  category: PostCategory;
}