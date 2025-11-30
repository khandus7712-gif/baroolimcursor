import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './components/Providers';

export const metadata: Metadata = {
  title: '바로올림 - AI 마케팅 콘텐츠 생성기',
  description: '업종 무관 AI 마케팅 콘텐츠 생성기',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

