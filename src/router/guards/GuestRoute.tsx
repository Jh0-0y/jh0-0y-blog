import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 이미 로그인한 사용자의 접근을 막는 컴포넌트
 * - 로그인/회원가입 페이지에 사용
 * - 이미 로그인된 경우 메인 페이지로 리다이렉트
 */
export const GuestRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (isAuthenticated) {
    // 이전 페이지 또는 메인으로 리다이렉트
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};