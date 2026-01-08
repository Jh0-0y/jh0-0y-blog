import type { TableOfContentsSection } from '../types';

/**
 * ISO 날짜 문자열을 'YYYY-MM-DD' 형식으로 변환
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * 콘텐츠 기반 읽기 시간 계산
 * - 한국어 기준 분당 약 500자
 */
export const calculateReadTime = (content: string | null | undefined): string => {
  if (!content) return '1분';
  
  const charCount = content.length;
  const minutes = Math.ceil(charCount / 500);
  return `${minutes}분`;
};

/**
 * 마크다운 콘텐츠에서 목차 추출
 */
export const extractTableOfContents = (content: string): TableOfContentsSection[] => {
  const sections: TableOfContentsSection[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    // ## 제목 (h2)
    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      sections.push({
        id: h2Match[1].trim(),
        title: h2Match[1].trim(),
        level: 2,
      });
      continue;
    }

    // ### 제목 (h3)
    const h3Match = line.match(/^### (.+)$/);
    if (h3Match) {
      sections.push({
        id: h3Match[1].trim(),
        title: h3Match[1].trim(),
        level: 3,
      });
    }
  }

  return sections;
};

/**
 * 목차 ID 생성 (URL-safe)
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};