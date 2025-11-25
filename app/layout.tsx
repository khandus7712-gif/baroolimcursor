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
        <meta name="naver-site-verification" content="6112b4d3c044559e1fcb1b4bd613506cf7f21014" />
        <link rel="alternate" type="application/rss+xml" title="바로올림 RSS 피드" href="https://baroolim.com/feed.xml" />
        <Script
          strategy="afterInteractive"
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-WVK7QKDXX9"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WVK7QKDXX9');
            `,
          }}
        />
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

