/**
 * NextAuth 설정 (디버그 버전)
 *
 * 목적:
 *  - 로그인 401 문제의 "진짜 원인"을 먼저 찾기 위해
 *  - DB/Prisma를 일단 완전히 우회해서 테스트하는 버전
 *
 * 이 버전에서는:
 *  - 이메일만 넣으면 항상 로그인 성공 (debug-user)
 *  - Prisma 쿼리는 전혀 실행하지 않음
 *  - 세션은 JWT 안에만 저장 (DB 세션 X)
 */

import { NextAuthOptions } from 'next-auth';
// PrismaAdapter는 유지하되, 지금 단계에선 사실상 사용되지 않음
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import { prisma } from './prisma';

// --- 환경변수 체크 로그 (서버 로그용, 문제되면 지워도 됨) ---
console.log('🔍 [auth.ts] ENV CHECK', {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  has_NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
  has_DB_URL: !!process.env.DATABASE_URL,
  has_GOOGLE_ID: !!process.env.GOOGLE_CLIENT_ID,
  has_KAKAO_ID: !!process.env.KAKAO_CLIENT_ID,
});

export const authOptions: NextAuthOptions = {
  /**
   * PrismaAdapter 유지
   *
   * - Credentials + JWT 전략에서는 필수는 아니지만,
   *   나중에 OAuth(구글/카카오) 쓸 때 필요하니 그대로 둔다.
   * - 지금 디버그용 Credentials는 DB를 전혀 사용하지 않는다.
   */
  adapter: PrismaAdapter(prisma),

  // JWT 암호화에 사용할 시크릿 (Vercel에 이미 설정되어 있음)
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    /**
     * 1) 디버그용 Credentials Provider
     *
     * - 이메일만 입력하면 항상 "debug-user"로 로그인 성공
     * - DB 조회/생성 전혀 안 함
     * - 이게 잘 되면: NextAuth/쿠키/도메인은 정상이라는 뜻
     * - 그 다음 단계에서만 Prisma를 다시 붙이면 됨
     */
    CredentialsProvider({
      name: 'Email only (DEBUG)',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' }, // UI용, 실제로는 안 씀
      },
      async authorize(credentials) {
        console.log('🔵 [DEBUG] Credentials 로그인 시도:', {
          email: credentials?.email,
        });

        if (!credentials?.email) {
          console.warn('⚠️ [DEBUG] 이메일이 없습니다.');
          return null;
        }

        // ✅ 여기서는 DB 전혀 사용하지 않고 더미 유저를 반환
        const email = credentials.email.trim().toLowerCase();

        const user = {
          id: 'debug-user-id',       // 고정된 더미 ID
          email,
          name: email.split('@')[0],
        };

        console.log('✅ [DEBUG] Credentials authorize 성공:', user);
        return user;
      },
    }),

    /**
     * 2) OAuth Providers (일단 남겨두지만, 굳이 테스트 안 해도 됨)
     *    - 나중에 Credentials가 정상 동작하는 것 확인된 뒤
     *      하나씩 테스트해보면 된다.
     */
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }),
        ]
      : []),

    ...(process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET
      ? [
          KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],

  /**
   * 콜백들: 디버그 단계에서는 DB를 전혀 호출하지 않고
   * 토큰/세션에 최소 정보만 넣어서 돌린다.
   */
  callbacks: {
    async jwt({ token, user, account }) {
      // 로그인 시도 직후에는 user가 들어온다
      if (user) {
        console.log('🔵 [DEBUG] JWT 생성:', {
          userId: (user as any).id,
          email: user.email,
          provider: account?.provider ?? 'credentials',
        });

        token.sub = (user as any).id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        session.user.email = token.email as string | null | undefined;
        session.user.name = token.name as string | null | undefined;
      }

      console.log('🔵 [DEBUG] 세션 생성:', {
        userId: (session.user as any)?.id,
        email: session.user?.email,
        name: session.user?.name,
      });

      return session;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',                 // 세션은 JWT로만 관리 (DB 세션 X)
    maxAge: 30 * 24 * 60 * 60,       // 30일
  },

  debug: process.env.NODE_ENV === 'development',
};
