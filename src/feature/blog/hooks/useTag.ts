import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '@/services/core/api.error';
import { tagApi } from '../api/tag.api';
import type { TagWithCount, GroupedTags, PopularTag } from '../api/tag.response';
import type {
  UseTagsWithCountReturn,
  UseGroupedTagsReturn,
  UsePopularTagsReturn,
} from './useTag.types';

// ========== useTagsWithCount ========== //
export const useTagsWithCount = (): UseTagsWithCountReturn => {
  const [tags, setTags] = useState<TagWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await tagApi.getTagsWithCount();
      if (response.success) {
        setTags(response.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return { tags, isLoading, error, refetch: fetchTags };
};

// ========== useGroupedTags ========== //
export const useGroupedTags = (): UseGroupedTagsReturn => {
  const [groupedTags, setGroupedTags] = useState<GroupedTags | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupedTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await tagApi.getGroupedTags();
      if (response.success) {
        setGroupedTags(response.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroupedTags();
  }, [fetchGroupedTags]);

  return { groupedTags, isLoading, error, refetch: fetchGroupedTags };
};

// ========== usePopularTags ========== //
export const usePopularTags = (limit: number = 5): UsePopularTagsReturn => {
  const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPopularTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await tagApi.getPopularTags(limit);
      if (response.success) {
        setPopularTags(response.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPopularTags();
  }, [fetchPopularTags]);

  return { popularTags, isLoading, error, refetch: fetchPopularTags };
};