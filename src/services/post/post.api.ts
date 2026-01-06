import { apiClient } from '@/services/core';
import type { ApiResponse, PageResponse, PageParams } from '@/services/core';
import type { CreatePostRequest, UpdatePostRequest } from './post.request';
import type { PostDetail, PostListItem, } from './post.response';
import type { PostCategory } from '@/domains/blog/types';



export const postApi = {
  /**
   * 공개 게시글 목록 조회
   */
  getPosts: async (params?: PageParams): Promise<ApiResponse<PageResponse<PostListItem>>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<PostListItem>>>('/posts', {
      params,
    });
    return response.data;
  },

  /**
   * 게시글 상세 조회
   */
  getPost: async (postId: number): Promise<ApiResponse<PostDetail>> => {
    const response = await apiClient.get<ApiResponse<PostDetail>>(`/posts/${postId}`);
    return response.data;
  },

  /**
   * 카테고리별 게시글 조회
   */
  getPostsByCategory: async (
    category: PostCategory,
    params?: PageParams
  ): Promise<ApiResponse<PageResponse<PostListItem>>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<PostListItem>>>(
      `/posts/category/${category}`,
      { params }
    );
    return response.data;
  },

  /**
   * 태그별 게시글 조회
   */
  getPostsByTag: async (
    tagName: string,
    params?: PageParams
  ): Promise<ApiResponse<PageResponse<PostListItem>>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<PostListItem>>>(
      `/posts/tag/${encodeURIComponent(tagName)}`,
      { params }
    );
    return response.data;
  },

  /**
   * 게시글 검색
   */
  searchPosts: async (
    keyword: string,
    params?: PageParams
  ): Promise<ApiResponse<PageResponse<PostListItem>>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<PostListItem>>>('/posts/search', {
      params: { keyword, ...params },
    });
    return response.data;
  },

  /**
   * 내 게시글 목록 조회
   */
  getMyPosts: async (params?: PageParams): Promise<ApiResponse<PageResponse<PostListItem>>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<PostListItem>>>('/posts/my', {
      params,
    });
    return response.data;
  },

  /**
   * 게시글 생성
   */
  createPost: async (request: CreatePostRequest): Promise<ApiResponse<PostDetail>> => {
    const response = await apiClient.post<ApiResponse<PostDetail>>('/posts', request);
    return response.data;
  },

  /**
   * 게시글 수정
   */
  updatePost: async (postId: number, request: UpdatePostRequest): Promise<ApiResponse<PostDetail>> => {
    const response = await apiClient.put<ApiResponse<PostDetail>>(`/posts/${postId}`, request);
    return response.data;
  },

  /**
   * 게시글 삭제
   */
  deletePost: async (postId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/posts/${postId}`);
    return response.data;
  },
};