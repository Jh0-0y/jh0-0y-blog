import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo } from '@/services/auth';

interface AuthState {
  // 상태
  accessToken: string | null;
  refreshToken: string | null;
  user: UserInfo | null;
  isAuthenticated: boolean;

  // 액션
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: UserInfo) => void;
  login: (accessToken: string, refreshToken: string, user: UserInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // 초기 상태
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      // 토큰만 설정
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      // 사용자 정보 설정
      setUser: (user) =>
        set({
          user,
        }),

      // 로그인 (토큰 + 사용자 정보)
      login: (accessToken, refreshToken, user) =>
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        }),

      // 로그아웃
      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);