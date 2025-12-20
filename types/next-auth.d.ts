/**
 * NextAuth 타입 확장
 */

import { DefaultSession } from 'next-auth';
import { SubscriptionPlan } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      plan?: SubscriptionPlan;
      totalGenerations?: number;
      dailyGenerationCount?: number;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
    plan?: SubscriptionPlan;
    totalGenerations?: number;
    dailyGenerationCount?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    sub: string;
    id?: string;
    email?: string | null;
    name?: string | null;
  }
}

