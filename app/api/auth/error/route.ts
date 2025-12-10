/**
 * NextAuth 에러 페이지
 * OAuth 로그인 중 에러가 발생했을 때 로그인 페이지로 리다이렉트
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  // 에러 로깅 (상세 정보 포함)
  console.error('🔴 NextAuth 에러 발생:', {
    error,
    errorDescription,
    url: request.url,
    fullUrl: request.url,
    searchParams: Object.fromEntries(searchParams.entries()),
    headers: {
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
    },
  });
  
  // 로그인 페이지로 리다이렉트 (에러 파라미터 포함)
  const loginUrl = new URL('/login', request.url);
  if (error) {
    loginUrl.searchParams.set('error', error);
    // error_description이 있으면 추가 정보로 표시
    if (errorDescription) {
      console.error('🔴 에러 상세:', errorDescription);
    }
  }
  
  return NextResponse.redirect(loginUrl);
}








