import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { blogPosts } from '@/content/blog/posts';

interface BlogPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: BlogPageProps): Metadata {
  const post = blogPosts.find((item) => item.slug === params.slug);

  if (!post) {
    return {
      title: '블로그 글을 찾을 수 없습니다',
      description: '요청하신 글이 존재하지 않습니다.',
    };
  }

  return {
    title: `${post.title} | 바로올림 블로그`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.keywords,
    },
  };
}

export default function BlogDetailPage({ params }: BlogPageProps) {
  const post = blogPosts.find((item) => item.slug === params.slug);

  if (!post) {
    return notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 text-gray-900">
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-lg ring-1 ring-gray-100">
        <Link href="/blog" className="text-sm font-medium text-blue-600">
        ← 블로그 목록으로
      </Link>
        <div className="mt-6 flex flex-col gap-2 text-sm text-gray-500">
          <span>{post.category}</span>
          <span>
            {post.date} · {post.readingTime}
          </span>
        </div>
        <h1 className="mt-4 text-4xl font-bold">{post.title}</h1>
        <p className="mt-6 text-lg leading-8 text-gray-700">{post.summary}</p>

        <div className="mt-10 space-y-10 text-lg leading-8 text-gray-800">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-semibold text-gray-900">{section.heading}</h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl bg-gray-50 p-6 text-gray-800">
          <h2 className="text-xl font-semibold text-gray-900">바로 적용할 인사이트</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            {post.takeaways.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}

