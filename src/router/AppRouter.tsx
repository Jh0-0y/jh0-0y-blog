import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from '@/router/guards';

import { BlogLayout } from '@/feature/blog/layouts/BlogLayout';
import { BlogHomePage, BlogPostPage, BlogWritePage, BlogEditPage } from '@/feature/blog/pages';

import { LoginPage, SignUpPage } from '@/pages/auth';
import { ProfilePage } from '@/feature/portfolio/pages';

import { NotFoundPage } from '@/pages/notfound';
import { ProjectDetailPage } from '@/feature/portfolio/pages/ProjectDetailPage';
import ToastTest from '@/pages/test/ToastTest';
// import ScrollToTop from '@/utils/scrollerToTop/ScrollerToTop';

export const AppRouter = () => (
  <BrowserRouter basename="/">
    {/* <ScrollToTop /> */}
    <Routes>
      {/* 블로그 (공개) */}
      <Route path="/" element={<BlogLayout />}>
        {/* 전체 글 */}
        <Route index element={<BlogHomePage />} />
        {/* 필터링된 글 */}
        <Route path=":postType">
          <Route index element={<BlogHomePage />} />
          <Route path="post/:id" element={<BlogPostPage />} />
        </Route>

        <Route path=":group/:stack">
          <Route index element={<BlogHomePage />} />
          <Route path="post/:id" element={<BlogPostPage />} />
        </Route>

        <Route path=":group/:stack/:postType">
          <Route index element={<BlogHomePage />} />
          <Route path="post/:id" element={<BlogPostPage />} />
        </Route>
        {/* 글 상세 */}
        <Route path="post/:id" element={<BlogPostPage />} />
        
        {/* 글쓰기 (인증 필요) */}
        <Route path="write" element={
          <ProtectedRoute>
            <BlogWritePage />
          </ProtectedRoute>
        } />
        
        {/* 글 수정 (인증 필요) */}
        <Route path="post/:id/edit" element={
          <ProtectedRoute>
            <BlogEditPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* 포트폴리오 (공개) */}
      <Route path="/portfolio" element={<ProfilePage />} />
      <Route path="/portfolio/project/:id" element={<ProjectDetailPage />} />

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

      <Route path="test" element={
        <ToastTest />
      } />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </BrowserRouter>
);