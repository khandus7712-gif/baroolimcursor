/**
 * Next.js Middleware
 * CORS 처리 및 요청 미들웨어
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

  // CORS 헤더 설정
  const response = NextResponse.next();

  // 모든 origin에 대해 CORS 허용 (개발/프로덕션 환경에 따라 조정 가능)
  // 또는 ALLOWED_ORIGINS가 설정된 경우에만 허용
  if (allowedOrigins.length > 0) {
    // ALLOWED_ORIGINS가 설정된 경우
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization, x-user-id'
      );
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
  } else {
    // ALLOWED_ORIGINS가 설정되지 않은 경우 - 모든 origin 허용
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, x-user-id'
    );
  }

  // OPTIONS 요청 처리 (하지만 App Router API에서 처리하도록 허용)
  // middleware는 단지 CORS 헤더만 추가하고 통과시킴
  return response;
}

export const config = {
  matcher: '/api/:path*',
};

