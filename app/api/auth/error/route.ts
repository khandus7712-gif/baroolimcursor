/**
 * NextAuth 에러 페이지
 * OAuth 로그인 중 에러가 발생했을 때 로그인 페이지로 리다이렉트
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get('error');
  
  // 에러 로깅
  console.error('🔴 NextAuth 에러 발생:', {
    error,
    url: request.url,
    searchParams: Object.fromEntries(searchParams.entries()),
  });
  
  // 로그인 페이지로 리다이렉트 (에러 파라미터 포함)
  const loginUrl = new URL('/login', request.url);
  if (error) {
    loginUrl.searchParams.set('error', error);
  }
  
  return NextResponse.redirect(loginUrl);
}

