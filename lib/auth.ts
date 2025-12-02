/**
 * NextAuth 설정
 */

import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

// 환경 변수 검증
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const kakaoClientId = process.env.KAKAO_CLIENT_ID;
const kakaoClientSecret = process.env.KAKAO_CLIENT_SECRET;

// 환경 변수 로드 확인 (항상 출력)
console.log('🔍 환경 변수 로드 확인:', {
  NODE_ENV: process.env.NODE_ENV,
  hasGoogleClientId: !!googleClientId,
  hasGoogleClientSecret: !!googleClientSecret,
  googleClientIdLength: googleClientId?.length || 0,
  hasKakaoClientId: !!kakaoClientId,
  hasKakaoClientSecret: !!kakaoClientSecret,
});

if (!googleClientId || !googleClientSecret) {
  console.warn('⚠️  Google OAuth가 설정되지 않았습니다. GOOGLE_CLIENT_ID와 GOOGLE_CLIENT_SECRET을 확인하세요.');
} else {
  // 환경 변수가 로드되었는지 확인 (마스킹된 값 출력)
  const maskedId =
    googleClientId.length > 10
      ? `${googleClientId.substring(0, 10)}...${googleClientId.substring(
          googleClientId.length - 10
        )}`
      : '***';
  console.log('✅ Google OAuth 환경 변수 로드됨:', {
    clientId: maskedId,
    clientIdLength: googleClientId.length,
    clientIdFirstChars: googleClientId.substring(0, 20),
    clientIdLastChars: googleClientId.substring(googleClientId.length - 20),
    hasSecret: !!googleClientSecret,
  });
}

if (!kakaoClientId || !kakaoClientSecret) {
  console.warn(
    '⚠️  Kakao OAuth가 설정되지 않았습니다. KAKAO_CLIENT_ID와 KAKAO_CLIENT_SECRET을 확인하세요.'
  );
} else {
  console.log('✅ Kakao OAuth 환경 변수 로드됨');
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  // 🔥 세션/JWT 암호화에 사용할 시크릿 (반드시 설정)
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    // Google OAuth (환경 변수가 있을 때만 활성화)
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId.trim(),
            clientSecret: googleClientSecret.trim(),
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

    // Kakao OAuth (환경 변수가 있을 때만 활성화)
    ...(kakaoClientId && kakaoClientSecret
      ? [
          KakaoProvider({
            clientId: kakaoClientId,
            clientSecret: kakaoClientSecret,
            profile(profile) {
              return {
                id: String(profile.id),
                name:
                  profile.kakao_account?.profile?.nickname ||
                  profile.properties?.nickname,
                email:
                  profile.kakao_account?.email ||
                  `kakao_${profile.id}@kakao.local`,
                image:
                  profile.kakao_account?.profile?.profile_image_url ||
                  profile.properties?.profile_image,
              };
            },
          }),
        ]
      : []),

    // 이메일/비밀번호 로그인 (간단한 버전)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('🔵 Credentials 로그인 시도:', {
            email: credentials?.email,
          });

          if (!credentials?.email) {
            console.warn('⚠️ 이메일이 제공되지 않음');
            return null;
          }

          // 이메일로 사용자 찾기 (비밀번호 체크는 나중에 bcrypt로 추가)
          let user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          console.log('🔵 사용자 조회 결과:', user ? '존재함' : '없음');

          // 사용자가 없으면 자동 생성 (빠른 온보딩)
          if (!user) {
            console.log('🔵 새 사용자 생성 중...');
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email.split('@')[0],
              },
            });
            console.log('✅ 새 사용자 생성 완료:', user.id);
          }

          return user;
        } catch (error) {
          console.error('🔴 Credentials 로그인 오류:', error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        // OAuth 로그인 시도 로깅
        console.log('🔵 OAuth signIn 콜백:', {
          userId: user?.id,
          email: user?.email,
          name: user?.name,
          provider: account?.provider,
          hasAccount: !!account,
          accountType: account?.type,
        });

        // 사용자 정보 확인
        if (!user?.email) {
          console.error('🔴 사용자 이메일이 없습니다:', user);
          return false;
        }

        return true; // 로그인 허용
      } catch (error) {
        console.error('🔴 signIn 콜백 오류:', error);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      // 리다이렉트 처리
      console.log('🔵 리다이렉트 콜백:', { url, baseUrl });

      // 상대 경로인 경우 baseUrl 추가
      if (url.startsWith('/')) {
        const fullUrl = `${baseUrl}${url}`;
        console.log('✅ 리다이렉트 URL:', fullUrl);
        return fullUrl;
      }

      // 같은 도메인이면 허용
      if (new URL(url).origin === baseUrl) {
        console.log('✅ 같은 도메인 리다이렉트:', url);
        return url;
      }

      // 기본적으로 baseUrl로 리다이렉트
      console.log('✅ 기본 리다이렉트:', baseUrl);
      return baseUrl;
    },

    async session({ session, token, user }) {
      try {
        // 세션에 userId 추가
        if (session.user) {
          session.user.id = token.sub || user?.id || '';

          console.log('🔵 세션 생성:', {
            userId: session.user.id,
            email: session.user.email,
            name: session.user.name,
            hasToken: !!token.sub,
            hasUser: !!user?.id,
          });

          // userId가 없으면 에러
          if (!session.user.id) {
            console.error('🔴 세션에 userId가 없습니다:', { token, user });
          }

          // 사용자 정보 최신화
          if (session.user.id) {
            const dbUser = await prisma.user.findUnique({
              where: { id: session.user.id },
              select: {
                plan: true,
                totalGenerations: true,
                dailyGenerationCount: true,
              },
            });

            if (dbUser) {
              session.user.plan = dbUser.plan;
              session.user.totalGenerations = dbUser.totalGenerations;
              session.user.dailyGenerationCount =
                dbUser.dailyGenerationCount;
            } else {
              console.warn(
                '⚠️ 데이터베이스에서 사용자를 찾을 수 없습니다:',
                session.user.id
              );
            }
          }
        }
        return session;
      } catch (error) {
        console.error('🔴 session 콜백 오류:', error);
        return session;
      }
    },

    async jwt({ token, user, account }) {
      try {
        // JWT 토큰 생성 시 로깅
        if (user) {
          console.log('🔵 JWT 토큰 생성:', {
            userId: user.id,
            email: user.email,
            name: user.name,
            provider: account?.provider,
          });
          token.sub = user.id;
          token.email = user.email;
          token.name = user.name;
        }
        return token;
      } catch (error) {
        console.error('🔴 jwt 콜백 오류:', error);
        return token;
      }
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
