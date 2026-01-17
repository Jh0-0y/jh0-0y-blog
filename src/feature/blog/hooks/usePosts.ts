import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getErrorMessage } from '@/services/core/api.error';
import { postApi } from '../api/post.api';
import type { PostListItem } from '../api/post.response';
import type { PostType } from '../types/post.enums';
import type { StackGroup } from '../../../services/stack/stack.enums';

export interface PostsFilter {
  postType?: PostType;
  stack?: string;
  group?: string;
  keyword?: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UsePostsReturn {
  posts: PostListItem[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  filter: PostsFilter;
  setPage: (page: number) => void;
  refetch: () => Promise<void>;
}

const DEFAULT_PAGE_SIZE = 6;

// PostType 검증
const POST_TYPES: PostType[] = ['CORE', 'ARCHITECTURE', 'TROUBLESHOOTING', 'ESSAY'];

const isPostType = (value: string | undefined): boolean => {
  if (!value) return false;
  return POST_TYPES.includes(value.toUpperCase() as PostType);
};

const toPostType = (value: string): PostType => {
  return value.toUpperCase() as PostType;
};

// StackGroup 검증
const STACK_GROUPS: StackGroup[] = ['LANGUAGE', 'FRAMEWORK', 'LIBRARY', 'DATABASE', 'DEVOPS', 'TOOL', 'ETC'];

const isStackGroup = (value: string | undefined): boolean => {
  if (!value) return false;
  return STACK_GROUPS.map((g) => g.toLowerCase()).includes(value.toLowerCase());
};

export const usePosts = (): UsePostsReturn => {
  // URL path params: /:postType, /:group/:stack, /:group/:stack/:postType
  const params = useParams<{ postType?: string; group?: string; stack?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 0,
    size: DEFAULT_PAGE_SIZE,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // URL에서 필터 파싱
  const getFilterFromURL = useCallback((): PostsFilter => {
    const { postType: postTypeParam, group: groupParam, stack: stackParam } = params;
    const keyword = searchParams.get('q') || undefined;

    let postType: PostType | undefined;
    let stack: string | undefined;
    let group: string | undefined;

    // Case 1: /:postType (예: /core)
    if (postTypeParam && !groupParam && !stackParam) {
      if (isPostType(postTypeParam)) {
        postType = toPostType(postTypeParam);
      }
    }

    // Case 2: /:group/:stack (예: /language/java)
    if (groupParam && stackParam) {
      if (isStackGroup(groupParam)) {
        group = groupParam.toLowerCase();
        stack = stackParam;
      }
    }

    // Case 3: /:group/:stack/:postType (예: /language/java/core)
    if (groupParam && stackParam && postTypeParam && isPostType(postTypeParam)) {
      postType = toPostType(postTypeParam);
    }

    return { postType, stack, group, keyword };
  }, [params, searchParams]);

  // URL에서 페이지 읽기
  const getPageFromURL = useCallback((): number => {
    const page = searchParams.get('page');
    return page ? parseInt(page, 10) : 0;
  }, [searchParams]);

  const filter = getFilterFromURL();
  const currentPage = getPageFromURL();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 백엔드 요청은 기존 query params 방식 유지
      const response = await postApi.getPosts({
        page: currentPage,
        size: pagination.size,
        postType: filter.postType,
        stack: filter.stack,
        keyword: filter.keyword,
      });

      if (response.success) {
        const data = response.data;
        setPosts(data.content);
        setPagination((prev) => ({
          ...prev,
          page: currentPage,
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
  }, [currentPage, pagination.size, filter.postType, filter.stack, filter.keyword]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 페이지 변경 (query string으로)
  const setPage = useCallback(
    (page: number) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (page > 0) {
          newParams.set('page', String(page));
        } else {
          newParams.delete('page');
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  return {
    posts,
    pagination: {
      ...pagination,
      page: currentPage,
    },
    isLoading,
    error,
    filter,
    setPage,
    refetch: fetchPosts,
  };
};