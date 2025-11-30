/**
 * Client-side Providers
 * NextAuth SessionProvider를 래핑
 */

'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // 5분마다 세션 갱신
      refetchOnWindowFocus={true} // 창 포커스 시 세션 갱신
    >
      {children}
    </SessionProvider>
  );
}

