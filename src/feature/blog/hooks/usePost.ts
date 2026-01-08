import { useState, useEffect, useCallback } from 'react';
import { getErrorMessage } from '@/services/core/api.error';
import { postApi } from '../api/post.api';
import type { PostDetail } from '../api/post.response';
import type { UsePostReturn } from './usePost.types';

export const usePost = (postId: number | undefined): UsePostReturn => {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await postApi.getPost(postId);
      if (response.success) {
        setPost(response.data);
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setPost(null);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  return {
    post,
    isLoading,
    error,
    refetch: fetchPost,
  };
};