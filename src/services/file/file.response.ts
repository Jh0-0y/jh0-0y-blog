import type { FileMetadataType } from './file.enum';

/**
 * 파일 업로드 응답
 */
export interface UploadResponse {
  id: number;
  originalName: string;
  url: string;
  fileMetadataType: FileMetadataType;
}