export interface UsePostDeleteReturn {
  isLoading: boolean;
  error: string | null;
  deletePost: (postId: number) => Promise<boolean>;
}