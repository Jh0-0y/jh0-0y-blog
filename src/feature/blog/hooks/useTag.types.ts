import type { TagWithCount, GroupedTags, PopularTag } from '../api/tag.response';

export interface UseTagsWithCountReturn {
  tags: TagWithCount[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseGroupedTagsReturn {
  groupedTags: GroupedTags | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UsePopularTagsReturn {
  popularTags: PopularTag[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}