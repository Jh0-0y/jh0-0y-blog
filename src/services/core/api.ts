import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authStore';

// API 기본 URL
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 첨부
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 시 자동 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // 401 에러 + 재시도 안 한 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const { refreshToken, setTokens, logout } = useAuthStore.getState();
      
      if (refreshToken) {
        try {
          // 토큰 갱신 요청
          const response = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // 새 토큰 저장
          setTokens(newAccessToken, newRefreshToken);
          
          // 원래 요청 재시도
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          // 갱신 실패 시 로그아웃
          logout();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // 리프레시 토큰 없으면 로그아웃
        logout();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);