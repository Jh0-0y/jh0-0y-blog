import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/services/auth/auth.api';

interface UseAuthReturn {
  // 상태
  isAuthenticated: boolean;
  user: ReturnType<typeof useAuthStore>['user'];
  
  // 액션
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout: clearAuth, setUser } = useAuthStore();

  // 로그아웃
  const logout = useCallback(() => {
    clearAuth();
    navigate('/login');
  }, [clearAuth, navigate]);

  // 사용자 정보 새로고침
  const refreshUser = useCallback(async () => {
    try {
      const response = await authApi.getMe();
      if (response.success) {
        setUser(response.data);
      }
    } catch {
      // 에러 시 로그아웃 처리
      logout();
    }
  }, [setUser, logout]);

  return {
    isAuthenticated,
    user,
    logout,
    refreshUser,
  };
};