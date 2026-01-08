import type { PostDetail } from '../api/post.response';

export interface UsePostReturn {
  post: PostDetail | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}