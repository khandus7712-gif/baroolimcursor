import Link from 'next/link';
import { notFound } from 'next/navigation';

const posts = {
  'generative-ai-marketing-guide': {
    title: '생성형 AI로 만드는 지역 밀착 마케팅 가이드',
    content: [
      '지역 기반 비즈니스는 고객과의 거리, 방문 동선, 계절별 수요에 따라 마케팅 전략이 크게 달라집니다. 생성형 AI는 업종·지역·고객 페르소나에 맞춘 문장을 빠르게 도출해 이러한 변수에 대응하도록 돕습니다.',
      '바로올림은 업종별 프로필과 플랫폼별 작성 규칙을 묶어 프롬프트를 자동 구성합니다. 예를 들어 창원 도계동의 소고기전골 식당이라면 “단체 예약 가능 여부, 좌석 회전 속도, 위생 포인트” 등을 자동으로 강조합니다.',
      '또한 이미지를 업로드하면 Vision API로 메뉴 외관을 분석해 구체적인 촉각·시각 묘사를 추가합니다. 이렇게 하면 자연스럽게 체류 시간이 늘고, 검색 엔진에서의 이해도도 높아집니다.',
    ],
    takeaways: ['고객 맥락에 맞춘 Hook → Pain Point → USP 흐름 유지', '이미지 캡션을 텍스트로 변환해 검색 노출 강화', '지역 키워드를 2~3회 반복해도 어색하지 않게 배치'],
  },
  'content-policy-checklist': {
    title: '애드센스 승인에 필요한 콘텐츠 체크리스트',
    content: [
      '애드센스 정책은 “사용자에게 실질적 가치를 주는 정보성 콘텐츠”를 요구합니다. 단순한 가격 안내나 이벤트 공지만 반복하면 심사에서 누락될 수 있습니다.',
      '바로올림은 업종별 Q&A 템플릿을 제공해 제품/서비스의 차별 포인트, 고객 질문, 실제 사례를 구조화합니다. 이를 활용하면 글자 수 1500자 이상의 블로그 글을 빠르게 채울 수 있습니다.',
      '심사 전에 반드시 개인정보 처리방침, 이용약관, 환불정책 같은 기본 페이지를 노출하세요. 이는 서비스 신뢰도를 보여주는 필수 신호입니다.',
    ],
    takeaways: ['한 포스트에 최소 3개의 하위 제목과 구체적 수치 포함', '고객 후기·검증 포인트를 사실 기반으로 작성', '정책 페이지 및 연락처를 명확히 표시'],
  },
  'platform-rule-updates': {
    title: '인스타그램·블로그·Threads 플랫폼 규칙 업데이트',
    content: [
      '인스타그램은 Hook → Pain Point → USP → CTA 구조를 고정했고, 문장당 이모지는 1개 이하로 제한했습니다. 이렇게 하면 짧고 명확한 스토리를 유지하면서도 감정선을 살릴 수 있습니다.',
      '블로그는 최소 글자 수 1500자, H1/H2 기반 구조, USP 및 감각 묘사, CTA 문단, 10~15개의 해시태그 규칙을 적용했습니다.',
      'Threads는 본글 2~3줄, 첫 댓글에는 Pain Point + USP, 두 번째 댓글에는 CTA만 작성하는 댓글형 시퀀스를 도입했습니다.',
    ],
    takeaways: ['플랫폼별 톤/길이/해시태그 규칙을 코드화', '생성 결과에서 금지 단어·영어 혼용을 자동 필터링', '운영팀이 규칙을 수정하면 실시간 반영되도록 설계'],
  },
};

type BlogSlug = keyof typeof posts;

interface BlogPageProps {
  params: { slug: BlogSlug };
}

export default function BlogDetailPage({ params }: BlogPageProps) {
  const post = posts[params.slug];

  if (!post) {
    return notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/blog" className="text-sm font-medium text-blue-600">
        ← 블로그 목록으로
      </Link>
      <h1 className="mt-6 text-4xl font-bold text-gray-900">{post.title}</h1>
      <div className="mt-4 space-y-6 text-lg leading-8 text-gray-700">
        {post.content.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <section className="mt-12 rounded-2xl bg-gray-50 p-6">
        <h2 className="text-xl font-semibold text-gray-900">바로 적용할 인사이트</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
          {post.takeaways.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

