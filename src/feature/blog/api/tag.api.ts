import { apiClient } from '@/services/core/apiClient';
import type { ApiResponse } from '@/services/core/api.response';
import type { CreateTagRequest, UpdateTagRequest } from './tag.request';
import type { GroupedTags, PopularTag, TagWithCount, } from './tag.response';
import type { TagGroup } from '../types/tag.enums';
import type { Tag } from '../types/tag.model'

export const tagApi = {
  /**
   * 전체 태그 목록 조회
   */
  getAllTags: async (): Promise<ApiResponse<Tag[]>> => {
    const response = await apiClient.get<ApiResponse<Tag[]>>('/tags');
    return response.data;
  },

  /**
   * 그룹별 태그 조회
   */
  getTagsByGroup: async (tagGroup: TagGroup): Promise<ApiResponse<Tag[]>> => {
    const response = await apiClient.get<ApiResponse<Tag[]>>(`/tags/group/${tagGroup}`);
    return response.data;
  },

  /**
   * 태그 + 게시글 수 조회 (사이드바용)
   */
  getTagsWithCount: async (): Promise<ApiResponse<TagWithCount[]>> => {
    const response = await apiClient.get<ApiResponse<TagWithCount[]>>('/tags/with-count');
    return response.data;
  },

  /**
   * 그룹별 태그 + 게시글 수 조회 (사이드바 All Tags용)
   */
  getGroupedTags: async (): Promise<ApiResponse<GroupedTags>> => {
    const response = await apiClient.get<ApiResponse<GroupedTags>>('/tags/grouped');
    return response.data;
  },

  /**
   * 인기 태그 조회 (사이드바 Popular Tags용)
   */
  getPopularTags: async (limit: number = 5): Promise<ApiResponse<PopularTag[]>> => {
    const response = await apiClient.get<ApiResponse<PopularTag[]>>('/tags/popular', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * 태그 생성
   */
  createTag: async (request: CreateTagRequest): Promise<ApiResponse<Tag>> => {
    const response = await apiClient.post<ApiResponse<Tag>>('/tags', request);
    return response.data;
  },

  /**
   * 태그 수정
   */
  updateTag: async (tagId: number, request: UpdateTagRequest): Promise<ApiResponse<Tag>> => {
    const response = await apiClient.put<ApiResponse<Tag>>(`/tags/${tagId}`, request);
    return response.data;
  },

  /**
   * 태그 삭제
   */
  deleteTag: async (tagId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/tags/${tagId}`);
    return response.data;
  },
};