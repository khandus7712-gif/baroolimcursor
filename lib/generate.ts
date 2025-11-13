/**
 * 콘텐츠 생성 유틸리티
 * API와 클라이언트에서 공통으로 사용하는 함수
 */

import type { GenerateContentRequest, GenerateContentResponse } from '@/types/generate';

/**
 * 콘텐츠 생성
 * @param request - 생성 요청
 * @returns 생성 응답
 */
export async function generateMarketingContent(
  request: GenerateContentRequest
): Promise<GenerateContentResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: 실제 인증 토큰 추가
      'x-user-id': 'mock-user-id',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate content');
  }

  return response.json();
}

