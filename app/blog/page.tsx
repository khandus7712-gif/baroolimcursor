import Link from 'next/link';

const posts = [
  {
    slug: 'generative-ai-marketing-guide',
    title: '생성형 AI로 만드는 지역 밀착 마케팅 가이드',
    summary:
      '동네 맛집, 카페, 교육 서비스까지 AI로 콘텐츠를 자동화하는 방법을 실제 사례 중심으로 정리했습니다.',
    category: '마케팅 전략',
    readingTime: '7분',
    date: '2025-11-24',
  },
  {
    slug: 'content-policy-checklist',
    title: '애드센스 승인에 필요한 콘텐츠 체크리스트',
    summary:
      '광고 심사를 통과한 고객사의 공통점을 분석해 필수 정보, 금지 요소, 카테고리 전략을 안내합니다.',
    category: '운영 가이드',
    readingTime: '5분',
    date: '2025-11-18',
  },
  {
    slug: 'platform-rule-updates',
    title: '인스타그램·블로그·Threads 플랫폼 규칙 업데이트',
    summary:
      '바로올림이 제공하는 플랫폼별 포맷 규칙과 활용 팁을 정리해 제작 효율을 높이는 방법을 공유합니다.',
    category: '제품 소식',
    readingTime: '6분',
    date: '2025-11-10',
  },
];

export default function BlogPage() {
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

