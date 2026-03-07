/**
 * NextAuth 설정 (테스트 계정 포함)
 *
 * 목적:
 *  - 토스페이먼츠 결제 테스트를 위한 테스트 계정 제공
 *  - DB/Prisma를 우회한 간단한 인증 시스템
 *
 * 이 버전에서는:
 *  - 테스트 계정으로 로그인 가능
 *  - Prisma 쿼리는 전혀 실행하지 않음
 *  - 세션은 JWT 안에만 저장 (DB 세션 X)
 */

import { NextAuthOptions } from 'next-auth';
// PrismaAdapter는 유지하되, 지금 단계에선 사실상 사용되지 않음
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import bcryptjs from 'bcryptjs';
import { prisma } from './prisma';

/**
 * 테스트 계정 목록
 * 토스페이먼츠 결제 테스트용
 */
const TEST_ACCOUNTS = [
  {
    email: 'test@baroolim.com',
    password: 'test1234',
    name: '테스트 사용자',
    id: 'test-user-1',
  },
  {
    email: 'payment@baroolim.com',
    password: 'payment1234',
    name: '결제 테스트',
    id: 'test-user-payment',
  },
  {
    email: 'admin@baroolim.com',
    password: 'admin1234',
    name: '관리자',
    id: 'admin-user',
  },
] as const;

// --- 환경변수 체크 및 에러 처리 ---
const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

console.log('🔍 [auth.ts] ENV CHECK', {
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_URL: nextAuthUrl,
  has_NEXTAUTH_SECRET: hasNextAuthSecret,
  has_DB_URL: !!process.env.DATABASE_URL,
  has_GOOGLE_ID: !!process.env.GOOGLE_CLIENT_ID,
  has_KAKAO_ID: !!process.env.KAKAO_CLIENT_ID,
});

// NEXTAUTH_SECRET이 없으면 명확한 에러 메시지
if (!hasNextAuthSecret) {
  console.error('🔴 [auth.ts] NEXTAUTH_SECRET이 설정되지 않았습니다!');
  console.error('🔴 Vercel 대시보드 → Settings → Environment Variables에서 NEXTAUTH_SECRET을 추가하세요.');
  console.error('🔴 생성 방법: openssl rand -base64 32');
}

export const authOptions: NextAuthOptions = {
  /**
   * PrismaAdapter 유지
   *
   * - Credentials + JWT 전략에서는 필수는 아니지만,
   *   나중에 OAuth(구글/카카오) 쓸 때 필요하니 그대로 둔다.
   * - 지금 디버그용 Credentials는 DB를 전혀 사용하지 않는다.
   */
  adapter: PrismaAdapter(prisma),

  // JWT 암호화에 사용할 시크릿
  // NEXTAUTH_SECRET이 없으면 NextAuth가 에러를 발생시킵니다
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    /**
     * 이메일/비밀번호 Credentials Provider
     *
     * - 데이터베이스에서 사용자 확인
     * - bcrypt로 비밀번호 검증
     * - 테스트 계정도 함께 지원 (하위 호환성)
     */
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔵 [AUTH] 로그인 시도:', {
          email: credentials?.email,
        });

        if (!credentials?.email || !credentials?.password) {
          console.warn('⚠️ [AUTH] 이메일 또는 비밀번호가 없습니다.');
          return null;
        }

        const email = credentials.email.trim().toLowerCase();
        const password = credentials.password;

        try {
          // 1. 데이터베이스에서 사용자 찾기
          const dbUser = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
            },
          });

          if (dbUser && dbUser.password) {
            // 데이터베이스 사용자: 비밀번호 검증
            const isValidPassword = await bcryptjs.compare(password, dbUser.password);
            
            if (isValidPassword) {
              console.log('✅ [AUTH] 데이터베이스 사용자 로그인 성공:', {
                id: dbUser.id,
                email: dbUser.email,
              });
              
              return {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name || undefined,
              };
            } else {
              console.warn('⚠️ [AUTH] 비밀번호가 일치하지 않습니다:', email);
              return null;
            }
          }

          // 2. 데이터베이스에 사용자가 없는 경우, 테스트 계정 확인 (하위 호환성)
          const testAccount = TEST_ACCOUNTS.find(
            (account) => account.email === email && account.password === password
          );

          if (testAccount) {
            // 테스트 계정인 경우, DB에 사용자가 없으면 자동 생성
            let userId: string = testAccount.id;
            
            try {
              const existingUser = await prisma.user.findUnique({
                where: { email: testAccount.email },
                select: { id: true },
              });

                if (!existingUser) {
                // 테스트 계정을 DB에 생성 (비밀번호 해시 저장)
                const hashedPassword = await bcryptjs.hash(testAccount.password, 10);
                const newUser = await prisma.user.create({
                  data: {
                    email: testAccount.email,
                    name: testAccount.name,
                    password: hashedPassword,
                  },
                });
                userId = newUser.id;
                console.log('✅ [AUTH] 테스트 계정을 DB에 생성:', userId);
              } else {
                userId = existingUser.id;
              }
            } catch (error) {
              console.error('🔴 [AUTH] 테스트 계정 DB 생성 실패:', error);
              // DB 생성 실패해도 테스트 계정 ID로 로그인 허용
            }

            console.log('✅ [AUTH] 테스트 계정 로그인 성공:', {
              id: userId,
              email: testAccount.email,
            });

            return {
              id: userId,
              email: testAccount.email,
              name: testAccount.name,
            };
          }

          console.warn('⚠️ [AUTH] 로그인 실패: 사용자를 찾을 수 없습니다:', email);
          return null;
        } catch (error) {
          console.error('🔴 [AUTH] 로그인 오류:', error);
          return null;
        }
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
            authorization: {
              params: {
                prompt: 'consent',
                access_type: 'offline',
                response_type: 'code',
              },
            },
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
   * 콜백들: OAuth 계정 생성 및 세션 관리
   */
  callbacks: {
    async signIn({ user, account, profile }) {
      // OAuth 로그인 시 계정 생성
      if (account?.provider === 'google' || account?.provider === 'kakao') {
        try {
          console.log('🔵 [AUTH] OAuth 로그인 시도:', {
            provider: account.provider,
            email: user.email,
            accountId: account.providerAccountId,
          });

          // PrismaAdapter가 자동으로 계정을 생성/연결하므로
          // 여기서는 true만 반환하면 됨
          return true;
        } catch (error) {
          console.error('🔴 [AUTH] OAuth 로그인 오류:', error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user, account, profile }) {
      // 로그인 시도 직후에는 user가 들어온다
      if (user) {
        console.log('🔵 [DEBUG] JWT 생성:', {
          userId: (user as any).id,
          email: user.email,
          provider: account?.provider ?? 'credentials',
        });

        // 테스트 계정(Credentials Provider)인 경우, DB에서 실제 사용자 ID를 찾아서 매핑
        if (account?.provider === 'credentials' && user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true },
            });
            
            if (dbUser) {
              console.log('✅ [AUTH] 테스트 계정 → DB 사용자 매핑:', {
                testId: (user as any).id,
                dbId: dbUser.id,
                email: user.email,
              });
              token.sub = dbUser.id; // 실제 DB 사용자 ID로 교체
            } else {
              // DB에 사용자가 없으면 테스트 계정 ID 유지
              token.sub = (user as any).id;
            }
          } catch (error) {
            console.error('🔴 [AUTH] DB 사용자 조회 실패:', error);
            token.sub = (user as any).id; // 오류 시 테스트 계정 ID 유지
          }
        } else {
          // OAuth 로그인인 경우 그대로 사용
          token.sub = (user as any).id;
        }

        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        session.user.email = token.email as string | null | undefined;
        session.user.name = token.name as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
      }

      console.log('🔵 [DEBUG] 세션 생성:', {
        userId: (session.user as any)?.id,
        email: session.user?.email,
        name: session.user?.name,
      });

      return session;
    },

    async redirect({ url, baseUrl }) {
      // 상대 URL인 경우 baseUrl과 결합
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // 같은 도메인인지 확인
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
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
