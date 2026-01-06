import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/auth/auth.api';
import type { LoginRequest } from '@/services/auth/auth.request';
import { useAuthStore } from '@/stores/authStore';
import { getErrorMessage, getFieldErrors } from '@/services/core/api.error';

interface UseLoginReturn {
  // 상태
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string> | null;

  // 액션
  login: (request: LoginRequest) => Promise<void>;
  clearError: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string> | null>(null);

  const login = async (request: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    setFieldErrors(null);

    try {
      const response = await authApi.login(request);

      if (response.success) {
        const { accessToken, refreshToken, user } = response.data;
        
        // 인증 상태 저장
        setAuth(accessToken, refreshToken, user);
        
        // 메인 페이지로 이동
        navigate('/');
      }
    } catch (err) {
      setError(getErrorMessage(err));
      setFieldErrors(getFieldErrors(err));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
    setFieldErrors(null);
  };

  return {
    isLoading,
    error,
    fieldErrors,
    login,
    clearError,
  };
};