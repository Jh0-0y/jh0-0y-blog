import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlogLayout } from '@/domains/blog/layouts/BlogLayout';
import { BlogHomePage, BlogPostPage, BlogWritePage } from '@/domains/blog/pages';
import { LoginPage, SignUpPage } from '@/domains/auth/pages';
import { NotFoundPage } from '@/pages/notfound';
import { ProtectedRoute, GuestRoute } from '@/router/guards';
import { ProfilePage, ProjectDetailPage } from '@/domains/profile/pages';

export const AppRouter = () => (
  <BrowserRouter basename="/">
    <Routes>
      {/* 블로그 (공개) */}
      <Route path="/" element={<BlogLayout />}>
        <Route index element={<BlogHomePage />} />
        <Route path="post/:id" element={<BlogPostPage />} />
        
        {/* 글쓰기/수정 (인증 필요) */}
        <Route path="write" element={
          <ProtectedRoute>
            <BlogWritePage />
          </ProtectedRoute>
        } />
        <Route path="edit/:id" element={
          <ProtectedRoute>
            <BlogWritePage />
          </ProtectedRoute>
        } />
      </Route>

      {/* 프로필 (공개) */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/project/:id" element={<ProjectDetailPage />} />

      {/* 로그인/회원가입 (비로그인만) */}
      <Route path="/login" element={
        <GuestRoute>
          <LoginPage />
        </GuestRoute>
      } />
      <Route path="/signup" element={
        <GuestRoute>
          <SignUpPage />
        </GuestRoute>
      } />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);