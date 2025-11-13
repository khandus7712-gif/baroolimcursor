/**
 * Client-side Providers
 * NextAuth SessionProvider를 래핑
 */

'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

