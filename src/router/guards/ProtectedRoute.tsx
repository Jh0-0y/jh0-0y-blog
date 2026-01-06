import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * - 미인증 시 로그인 페이지로 리다이렉트
 * - 로그인 후 원래 페이지로 돌아올 수 있도록 현재 경로 저장
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // 로그인 후 돌아올 경로 저장
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

