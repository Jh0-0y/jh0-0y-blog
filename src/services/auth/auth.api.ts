import { apiClient } from '../core/apiClient';
import type { ApiResponse } from '@/services/core/api.response';

import type { UserInfo } from '@/types/user.types';
import type { LoginRequest, SignUpRequest } from './auth.request';
import type { LoginResponse } from './auth.response';

export const authApi = {
  /**
   * 회원가입
   * - 성공 시 쿠키에 토큰 자동 저장
   */
  signUp: async (request: SignUpRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/signup', request);
    return response.data;
  },

  /**
   * 로그인
   * - 성공 시 쿠키에 토큰 자동 저장
   */
  login: async (request: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', request);
    return response.data;
  },

  /**
   * 로그아웃
   * - 쿠키에서 토큰 삭제
   */
  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
    return response.data;
  },

  /**
   * 토큰 재발급
   * - 쿠키의 Refresh Token으로 자동 처리
   */
  refresh: async (): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/refresh');
    return response.data;
  },

  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<ApiResponse<UserInfo>> => {
    const response = await apiClient.get<ApiResponse<UserInfo>>('/auth/me');
    return response.data;
  },
};