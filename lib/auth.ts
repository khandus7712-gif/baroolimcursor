/**
 * NextAuth 설정
 */

import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    // Kakao OAuth
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID || '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
    }),
    // 이메일/비밀번호 로그인 (간단한 버전)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: '이메일', type: 'email' },
        password: { label: '비밀번호', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        // 이메일로 사용자 찾기 (비밀번호 체크는 나중에 bcrypt로 추가)
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 사용자가 없으면 자동 생성 (빠른 온보딩)
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
            },
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }) {
      // 세션에 userId 추가
      if (session.user) {
        session.user.id = token.sub || user?.id || '';
        
        // 사용자 정보 최신화
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
          session.user.dailyGenerationCount = dbUser.dailyGenerationCount;
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
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

