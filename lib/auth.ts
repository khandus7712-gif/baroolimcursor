/**
 * NextAuth 설정
 *
 * 목적:
 *  - Google / Kakao OAuth 로그인
 *  - 이메일/비밀번호 Credentials 로그인
 *  - JWT 세션 전략 (DB 세션 X)
 *
 * 주의:
 *  - PrismaAdapter는 JWT 전략과 충돌하므로 제거
 *  - OAuth 로그인 후 필요 시 수동으로 DB에 사용자 저장
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import bcryptjs from 'bcryptjs';
import { prisma } from './prisma';

/**
 * 테스트 계정 목록
 */
const TEST_ACCOUNTS = [
  {
    email: 'test@baroolim.com',
    password: 'test1234',
    name: '테스트 사용자',
  },
  {
    email: 'payment@baroolim.com',
    password: 'payment1234',
    name: '결제 테스트',
  },
  {
    email: 'admin@baroolim.com',
    password: 'admin1234',
    name: '관리자',
  },
];

// 환경변수 체크
if (!process.env.NEXTAUTH_SECRET) {
  console.error('🔴 [auth.ts] NEXTAUTH_SECRET이 설정되지 않았습니다!');
}

export const authOptions: NextAuthOptions = {
  // ✅ PrismaAdapter 제거 - JWT 전략과 충돌 방지
  // adapter: PrismaAdapter(prisma),

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    /**
     * 이메일/비밀번호 로그인
     */
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email;
        const rawPassword = credentials?.password;

        if (
          typeof rawEmail !== 'string' ||
          typeof rawPassword !== 'string' ||
          !rawEmail.trim() ||
          !rawPassword
        ) {
          return null;
        }

        const email = rawEmail.trim().toLowerCase();

        try {
          // 1. DB에서 사용자 찾기
          const dbUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, password: true },
          });

          if (dbUser && dbUser.password) {
            const isValid = await bcryptjs.compare(rawPassword, dbUser.password);
            if (!isValid) return null;

            return {
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name ?? undefined,
            };
          }

          // 2. 테스트 계정 확인
          const testAccount = TEST_ACCOUNTS.find(
            (a) => a.email === email && a.password === rawPassword
          );

          if (testAccount) {
            // ✅ string 타입 명시로 타입 에러 해결
            let userId: string = '';

            try {
              const existing = await prisma.user.findUnique({
                where: { email: testAccount.email },
                select: { id: true },
              });

              if (!existing) {
                const hashed = await bcryptjs.hash(testAccount.password, 10);
                const newUser = await prisma.user.create({
                  data: {
                    email: testAccount.email,
                    name: testAccount.name,
                    password: hashed,
                  },
                });
                userId = newUser.id;
                console.log('✅ [AUTH] 테스트 계정 DB 생성:', userId);
              } else {
                userId = existing.id;
              }
            } catch (err) {
              console.error('🔴 [AUTH] 테스트 계정 DB 처리 실패:', err);
              userId = `test-${testAccount.email}`;
            }

            return {
              id: userId,
              email: testAccount.email,
              name: testAccount.name,
            };
          }

          return null;
        } catch (error) {
          console.error('🔴 [AUTH] 로그인 오류:', error);
          return null;
        }
      },
    }),

    /**
     * Google OAuth
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

    /**
     * Kakao OAuth
     */
    ...(process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET
      ? [
          KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
          }),
        ]
      : []),
  ],

  callbacks: {
    /**
     * OAuth 로그인 시 DB에 사용자 자동 저장
     */
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'kakao') {
        if (!user.email) return false;

        try {
          const existing = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existing) {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name ?? '',
                image: user.image ?? null,
              },
            });
            console.log('✅ [AUTH] OAuth 신규 사용자 DB 저장:', user.email);
          }
        } catch (err) {
          console.error('🔴 [AUTH] OAuth DB 저장 실패:', err);
          // DB 저장 실패해도 로그인은 허용
        }
      }

      return true;
    },

    /**
     * JWT 토큰 생성
     */
    async jwt({ token, user, account }) {
      if (user) {
        if (user.email) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email },
              select: { id: true },
            });

            token.sub = dbUser?.id ?? (user as any).id;
          } catch {
            token.sub = (user as any).id;
          }
        }

        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.provider = account?.provider ?? 'credentials';
      }

      return token;
    },

    /**
     * 세션 데이터 구성
     */
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        session.user.email = token.email as string | null | undefined;
        session.user.name = token.name as string | null | undefined;
        session.user.image = token.picture as string | null | undefined;
      }

      return session;
    },

    /**
     * 리다이렉트 처리
     */
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  debug: process.env.NODE_ENV === 'development',
};