import { apiClient } from '@/services/core/apiClient';
import type { UploadResponse } from './file.response';

export const fileApi = {
  /**
   * 에디터 파일 임시 업로드 (MIME 타입 기반 자동 분류)
   * POST /api/files/upload
   */
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<UploadResponse>(
      '/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  },
};