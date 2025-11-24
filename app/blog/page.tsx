import type { Metadata } from 'next';
import Link from 'next/link';

import { blogPosts } from '@/content/blog/posts';

export const metadata: Metadata = {
  title: '바로올림 블로그 - AI 마케팅 & 애드센스 인사이트',
  description:
    '애드센스 승인용 정보성 콘텐츠, 로컬 SEO 전략, 생성형 AI 활용법을 정기적으로 발행합니다. 구글 정책과 사용자 경험을 충족하는 블로그 운영 팁을 확인하세요.',
};

export default function BlogPage() {
  const posts = [...blogPosts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <section className="mb-12">
        <p className="text-sm font-semibold text-blue-600">BAROOLIM BLOG</p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900">AI 마케팅 인사이트</h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600">
          애드센스 정책에 맞는 정보성 글을 중심으로, 생성형 AI를 활용해 마케팅 콘텐츠를 어떻게 만들고 운영할지
          바로올림 팀이 직접 정리하고 있습니다.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="text-xs font-medium text-blue-500">{post.category}</p>
            <h2 className="mt-3 text-xl font-semibold text-gray-900">{post.title}</h2>
            <p className="mt-2 text-sm text-gray-600">{post.summary}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>{post.date}</span>
              <span>{post.readingTime} 소요</span>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600"
            >
              자세히 보기 →
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

