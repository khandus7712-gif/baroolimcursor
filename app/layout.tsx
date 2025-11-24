import type { Metadata } from 'next';
import Script from 'next/script';
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
      <head>
        <meta name="google-site-verification" content="BjPOGJAR6xrQN_-1KLoJyCa054ZPtaUOqVAgEcKlTWY" />
        <Script
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3134075533582004"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

