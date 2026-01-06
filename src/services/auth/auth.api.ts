import { apiClient } from "../core/api";
import type { ApiResponse } from "@/services/core";
import type { LoginRequest, RefreshRequest, SignUpRequest } from "./auth.request";
import type { TokenResponse, UserInfo } from "./auth.response";

export const authApi = {
  /**
   * 회원가입
   */
  signUp: async (request: SignUpRequest): Promise<ApiResponse<TokenResponse>> => {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/signup', request);
    return response.data;
  },

  /**
   * 로그인
   */
  login: async (request: LoginRequest): Promise<ApiResponse<TokenResponse>> => {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/login', request);
    return response.data;
  },

  /**
   * 토큰 재발급
   */
  refresh: async (request: RefreshRequest): Promise<ApiResponse<TokenResponse>> => {
    const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/refresh', request);
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