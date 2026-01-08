import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '@/services/core/api.error';
import { postApi } from '../api/post.api';
import type { PostListItem } from '../api/post.response';
import type { PostsFilter, Pagination, UsePostsReturn } from './usePosts.types';

const DEFAULT_PAGE_SIZE = 10;

export const usePosts = (initialFilter?: PostsFilter): UsePostsReturn => {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [filter, setFilter] = useState<PostsFilter>(initialFilter || {});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await postApi.getPosts({
        page: pagination.page,
        size: pagination.size,
        category: filter.category,
        tag: filter.tag,
        keyword: filter.keyword,
      });

      if (response.success) {
        const data = response.data;
        setPosts(data.content);
        setPagination((prev) => ({
          ...prev,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
          hasNext: data.hasNext,
          hasPrevious: data.hasPrevious,
        }));
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.size, filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSetFilter = useCallback((newFilter: PostsFilter) => {
    setFilter(newFilter);
    setPagination((prev) => ({ ...prev, page: 0 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  }, []);

  return {
    posts,
    pagination,
    isLoading,
    error,
    filter,
    setFilter: handleSetFilter,
    setPage,
    refetch: fetchPosts,
  };
};