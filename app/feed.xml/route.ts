import { NextResponse } from 'next/server';
import { blogPosts } from '@/content/blog/posts';

export async function GET() {
  const baseUrl = 'https://baroolim.com';

  // RSS 2.0 형식으로 생성
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>바로올림 - AI 마케팅 콘텐츠 생성기</title>
    <description>업종 무관 AI 마케팅 콘텐츠 생성기</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <language>ko-KR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    ${blogPosts
      .map((post) => {
        const postUrl = `${baseUrl}/blog/${post.slug}`;
        const pubDate = new Date(post.date).toUTCString();
        const description = post.description || post.summary;
        
        // 섹션 내용을 HTML로 변환
        const content = post.sections
          .map((section) => {
            const body = section.body.join(' ');
            return `<h3>${section.heading}</h3><p>${body}</p>`;
          })
          .join('');

        return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${description}]]></description>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      <content:encoded xmlns:content="http://purl.org/rss/1.0/modules/content/"><![CDATA[${content}]]></content:encoded>
    </item>`;
      })
      .join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}



