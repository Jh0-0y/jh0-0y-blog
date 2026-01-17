import { apiClient } from '../core/apiClient';
import type { ApiResponse } from '@/services/core/api.response';

import type { UserResponse } from './user.response';
import type { ChangePasswordRequest, UpdateProfileRequest } from './user.request';


export const userApi = {

  /**
   * 내 정보 조회
   */
  getMe: async (): Promise<ApiResponse<UserResponse>> => {
    const response = await apiClient.get<ApiResponse<UserResponse>>('/auth/me');
    return response.data;
  },
  
  /**
   * 프로필 수정 (닉네임, 이미지)
   * PATCH /api/me/profile
   */
  updateProfile: async (
    request: UpdateProfileRequest,
    profileImage?: File
  ): Promise<ApiResponse<UserResponse>> => {
    const formData = new FormData();

    // JSON 데이터를 Blob으로 만들어 추가 (컨트롤러의 @RequestPart 대응)
    if (request.nickname) {
      formData.append(
        'request',
        new Blob([JSON.stringify(request)], { type: 'application/json' })
      );
    }

    // 이미지 파일 추가
    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    const response = await apiClient.patch<ApiResponse<UserResponse>>('/me/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * 비밀번호 변경
   * PATCH /api/me/password
   */
  changePassword: async (request: ChangePasswordRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.patch<ApiResponse<void>>('/me/password', request);
    return response.data;
  },
};