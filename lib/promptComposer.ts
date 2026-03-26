/**
 * Prompt Composer
 * System/Platform/Brand/Plugins/Content 섹션으로 프롬프트를 조합
 */

import type { DomainProfile } from '@/types/domain';
import type { PlatformTemplate } from '@/types/platform';
import type { Plugin } from '@/types/plugin';

/**
 * 프롬프트 컴포저 입력 타입
 */
export interface PromptComposerInput {
  domain: DomainProfile;
  platform: PlatformTemplate;
  contact?: {
    phoneNumber?: string;
    kakaoChannel?: string;
  };
  brand?: {
    name: string;
    tone?: string;
    keywords?: string[];
    voiceHints?: string[];
  };
  plugins?: Plugin[];
  content: {
    notes?: string;
    keywords?: string[];
    imageCaptions?: string[]; // Vision 전처리 결과 (alt-like caption)
    region?: string;
    link?: string;
  };
  searchContext?: string; // 웹 검색 결과 (포맷팅된 문자열)
  writingPurpose?: 'seo' | 'aeo'; // 글쓰기 목적: 네이버 검색(SEO) vs AI 검색(AEO)
}

/**
 * 프롬프트 컴포저
 * @param input - 프롬프트 컴포저 입력
 * @returns 조합된 프롬프트 문자열
 */
export function composePrompt(input: PromptComposerInput): string {
  const sections: string[] = [];

  // [SYSTEM] 섹션
  sections.push(createSystemSection(input.domain));

  // [PLATFORM_RULES] 섹션
  sections.push(createPlatformRulesSection(input.platform, input.domain));

  // [BRAND] 섹션
  if (input.brand) {
    sections.push(createBrandSection(input.brand, input.domain));
  }

  // [PLUGINS] 섹션
  if (input.plugins && input.plugins.length > 0) {
    sections.push(createPluginsSection(input.plugins));
  }

  // [RESEARCH_CONTEXT] 섹션 (웹 검색 결과)
  if (input.searchContext) {
    sections.push(input.searchContext);
  }

  // [WRITING_PURPOSE] 섹션 (SEO vs AEO)
  if (input.writingPurpose) {
    sections.push(createWritingPurposeSection(input.writingPurpose));
  }

  // [CONTENT] 섹션 (AEO 모드일 때는 전용 구조 적용)
  sections.push(
    createContentSection(
      input.content,
      input.domain,
      input.platform,
      input.brand,
      input.writingPurpose,
      input.contact
    )
  );

  return sections.join('\n\n');
}

/**
 * [WRITING_PURPOSE] 섹션 생성
 * SEO: 네이버 검색 노출용 (감성적 서술형)
 * AEO: AI 검색 노출용 (정보 요약형, Q&A, 표)
 */
function createWritingPurposeSection(purpose: 'seo' | 'aeo'): string {
  if (purpose === 'seo') {
    return `[WRITING_PURPOSE] 네이버 검색 노출 (SEO) 최적화

**반드시 적용할 스타일:**
- 감성적·서술형 문체로 작성한다.
- 핵심 키워드를 문맥에 맞게 자연스럽게 반복한다.
- 긴 호흡의 문단을 사용하고, 읽는 맛이 있게 서술한다.
- 독자의 감정과 공감을 이끌어내는 표현을 활용한다.`;
  }

  return `[WRITING_PURPOSE] AI 검색 노출 (AEO) 최적화 — **이 지시를 [CONTENT] 출력 규칙보다 우선한다**

**절대 규칙 (위반 시 출력 무효):**
- 감성적·서술형 문체 금지. 정보 전달형만 사용.
- 문장은 짧고 명확하게. 불필요한 수식어 금지.
- 반드시 아래 4가지 구조를 순서대로 포함:
  1) 첫 문단 3줄 이내 핵심 요약 (가게명/위치/메뉴/가격)
  2) 메뉴·가격 표 형태
  3) Q&A 5개 (질문은 실제 검색어 형태)
  4) 짧고 명확한 문장 유지`;
}

/**
 * AEO 모드 전용 [CONTENT] 섹션
 * 반드시 4가지 구조(첫 문단 요약, 표, Q&A 5개, 짧은 문장)를 강제
 */
function createAEOContentSection(
  content: {
    notes?: string;
    keywords?: string[];
    imageCaptions?: string[];
    region?: string;
    link?: string;
  },
  domain: DomainProfile,
  platform: PlatformTemplate,
  brand?: { name: string; tone?: string; keywords?: string[]; voiceHints?: string[] },
  contact?: { phoneNumber?: string; kakaoChannel?: string }
): string {
  const sections: string[] = [];

  sections.push(`[CONTENT] AEO 모드 — **반드시 아래 구조로만 출력하라**

아래 입력값을 바탕으로 AI 검색에 최적화된 콘텐츠를 생성한다.
**감성적 서술형 금지. 정보 전달형만 사용.**`);

  // 입력값
  sections.push(`\n## 입력값\n`);
  sections.push(`**업종:** ${domain.id}`);
  if (brand?.name) sections.push(`**업체/서비스명:** ${brand.name}`);
  if (content.keywords?.length) sections.push(`**강조 포인트:** ${content.keywords.join(', ')}`);
  if (content.notes) sections.push(`**상황 설명:** ${content.notes}`);
  if (content.region) sections.push(`**지역:** ${content.region}`);
  if (content.link) sections.push(`**링크:** ${content.link}`);
  if (content.imageCaptions?.length) {
    sections.push(`\n**이미지 설명:**`);
    content.imageCaptions.forEach((c, i) => sections.push(`${i + 1}. ${c}`));
  }

  // CTA/연락처 (AEO에서도 마지막에 반드시 포함)
  const ctaText = domain.sampleCTAs && domain.sampleCTAs.length > 0
    ? domain.sampleCTAs[0]
    : '지금 바로 상담받아보세요!';
  sections.push(`\n**CTA 문구(cta_text):** ${ctaText}`);

  const contactLines: string[] = [];
  if (contact?.phoneNumber) contactLines.push(`전화: ${contact.phoneNumber}`);
  if (contact?.kakaoChannel) contactLines.push(`카카오 채널: ${contact.kakaoChannel}`);
  if (contactLines.length > 0) {
    sections.push(`**연락처 안내(contact):** ${contactLines.join(' / ')}`);
  }

  sections.push(`\n## 🚨 출력 구조 (순서·형식 준수 필수)

### 1. 첫 문단 — 핵심 요약 (3줄 이내)
- 가게명/업체명, 위치, 대표 메뉴/서비스, 가격을 한눈에 요약
- 3줄을 초과하지 않는다
- 감성적 표현 없이 사실만 나열

### 2. 메뉴/가격 표 (업종에 맞게)
- 반드시 표 형태로 작성 (예: | 메뉴 | 가격 | 비고 |)
- 메뉴/서비스/상품이 없으면 운영정보·가격정보 표로 대체
- 표가 없으면 출력 무효

### 3. Q&A 5개 (실제 검색어 형태 질문)
- 질문은 사용자가 실제로 검색할 법한 형태 (예: "OO 맛집 가격", "OO 예약 방법", "OO 영업시간")
- Q: (질문) / A: (답변) 형식
- 답변은 1~2문장으로 짧게

### 4. 문장 스타일
- 모든 문장은 짧고 명확하게
- 수식어·감성 표현 최소화
- 정보 전달 우선

### 5. 마무리 — 결론 및 CTA(필수)
- 마지막 문단에 반드시 CTA 문구(cta_text)를 포함한다
- 연락처(contact)가 있으면 CTA 문단에 함께 포함한다 (전화/카카오)
- URL(link)이 있으면 반드시 "링크 및 참고 자료: <URL>" 형태로 함께 포함한다
- CTA 문단은 2~3문장 이내로 짧게 작성한다`);

  if (domain.mandatoryPhrases?.length) {
    sections.push(`\n**필수 구문:** ${domain.mandatoryPhrases.join(', ')}`);
  }
  if (domain.bannedPhrases?.length) {
    sections.push(`\n**금지 구문:** ${domain.bannedPhrases.join(', ')}`);
  }

  sections.push(`\n**언어:** 한국어만 사용.`);

  return sections.join('\n');
}

/**
 * [SYSTEM] 섹션 생성
 */
function createSystemSection(domain: DomainProfile): string {
  return `[SYSTEM]

You are an expert marketing content writer specializing in the ${domain.id} industry.

Brand Voice:
- Description: ${domain.tone.brandVoiceDesc}
- Formality: ${domain.tone.formality}

Value Propositions:
${domain.valueProps.map((vp) => `- ${vp}`).join('\n')}

Key Entities:
${domain.entities.map((e) => `- ${e}`).join('\n')}

Mandatory Phrases (must use naturally):
${(domain.mandatoryPhrases || []).map((p) => `- ${p}`).join('\n')}

Banned Phrases (NEVER use - will be filtered in post-processing):
${(domain.bannedPhrases || []).map((p) => `- ${p}`).join('\n')}

Compliance Notes:
${(domain.complianceNotes || []).map((n) => `- ${n}`).join('\n')}

KPIs to Consider:
${domain.kpis.map((kpi) => `- ${kpi}`).join('\n')}`;
}

/**
 * [PLATFORM_RULES] 섹션 생성
 */
function createPlatformRulesSection(
  platform: PlatformTemplate,
  domain: DomainProfile
): string {
  const mustInclude = platform.mustInclude || [];
  const bannedWords = platform.bannedWords || [];

  return `[PLATFORM_RULES]

Platform: ${platform.id}
Maximum Characters: ${platform.maxChars}
Line Break Style: ${platform.lineBreakStyle}
Hashtag Count: ${platform.hashtagCount}
Emoji Allowed: ${platform.emojiAllowed}

Style Hints:
${platform.styleHints.map((hint) => `- ${hint}`).join('\n')}

Must Include (will be checked in post-processing):
${mustInclude.map((item) => `- ${item}`).join('\n')}

Banned Words (will be filtered in post-processing):
${bannedWords.map((word) => `- ${word}`).join('\n')}

Output Format:
${platform.outputFormatHint}`;
}

/**
 * [BRAND] 섹션 생성
 */
function createBrandSection(
  brand: { name: string; tone?: string; keywords?: string[]; voiceHints?: string[] },
  domain: DomainProfile
): string {
  const sections: string[] = [`[BRAND]\n\nBrand Name: ${brand.name}`];

  if (brand.tone) {
    sections.push(`Brand Tone: ${brand.tone}`);
  }

  if (brand.keywords && brand.keywords.length > 0) {
    sections.push(`Brand Keywords: ${brand.keywords.join(', ')}`);
  }

  if (brand.voiceHints && brand.voiceHints.length > 0) {
    sections.push(`Voice Hints:\n${brand.voiceHints.map((hint) => `- ${hint}`).join('\n')}`);
  }

  // 도메인 톤을 오버라이드하되, 브랜드 톤이 명시되어 있으면 우선 적용
  if (brand.tone) {
    sections.push(`\nNote: Use brand tone "${brand.tone}" while maintaining ${domain.tone.formality} formality.`);
  }

  return sections.join('\n');
}

/**
 * [PLUGINS] 섹션 생성
 */
function createPluginsSection(plugins: Plugin[]): string {
  const guides = plugins.map((plugin) => plugin.renderGuide()).filter((guide) => guide);

  if (guides.length === 0) {
    return '';
  }

  return `[PLUGINS]

Additional Requirements:
${guides.map((guide, i) => `${i + 1}. ${guide}`).join('\n\n')}`;
}

/**
 * [CONTENT] 섹션 생성
 */
function createContentSection(
  content: {
    notes?: string;
    keywords?: string[];
    imageCaptions?: string[];
    region?: string;
    link?: string;
  },
  domain: DomainProfile,
  platform: PlatformTemplate,
  brand?: { name: string; tone?: string; keywords?: string[]; voiceHints?: string[] },
  writingPurpose?: 'seo' | 'aeo',
  contact?: { phoneNumber?: string; kakaoChannel?: string }
): string {
  // AEO 모드: 플랫폼별 SEO 프롬프트 무시, 전용 구조 강제
  if (writingPurpose === 'aeo') {
    return createAEOContentSection(content, domain, platform, brand, contact);
  }

  const sections: string[] = ['[CONTENT]\n\nCreate marketing content with the following information:'];

  // 이미지 캡션 (Vision 전처리 결과)
  if (content.imageCaptions && content.imageCaptions.length > 0) {
    sections.push('Image Descriptions:');
    content.imageCaptions.forEach((caption, index) => {
      sections.push(`${index + 1}. ${caption}`);
    });
    sections.push(
      'Use these image descriptions to create visually-rich storytelling. Reference the images naturally in the content.'
    );
  }

  // 사용자 메모
  if (content.notes) {
    sections.push(`User Notes: ${content.notes}`);
  }

  // 키워드
  if (content.keywords && content.keywords.length > 0) {
    sections.push(`Keywords to emphasize: ${content.keywords.join(', ')}`);
  }

  // 지역 정보
  if (content.region) {
    sections.push(`Region/Location: ${content.region}`);
  }

  // 링크
  if (content.link) {
    sections.push(`Link to include (if platform allows): ${content.link}`);
  }

  // CTA 샘플
  if (domain.sampleCTAs && domain.sampleCTAs.length > 0) {
    sections.push(
      `\nSample CTAs (use as inspiration, adapt to context):\n${domain.sampleCTAs.map((cta) => `- ${cta}`).join('\n')}`
    );
  }

  // 해시태그 시드
  if (domain.hashtagSeeds && domain.hashtagSeeds.length > 0) {
    sections.push(
      `\nHashtag Seeds (use ${platform.hashtagCount} or fewer, combine with region/keywords):\n${domain.hashtagSeeds.slice(0, 20).map((seed) => `- #${seed}`).join(' ')}`
    );
  }

  // 블로그 플랫폼일 때 특별한 프롬프트 적용
  if (platform.id === 'blog') {
    return createBlogPrompt(content, domain, brand, contact);
  }

  // Threads 플랫폼일 때 특별한 프롬프트 적용
  if (platform.id === 'threads') {
    return createThreadsPrompt(content, domain, brand);
  }

  // Instagram 플랫폼일 때 특별한 프롬프트 적용
  if (platform.id === 'instagram') {
    return createInstagramPrompt(content, domain, brand);
  }

  // Google My Business 플랫폼일 때 특별한 프롬프트 적용
  if (platform.id === 'gmb') {
    return createGMBPrompt(content, domain, brand);
  }

  sections.push(
    `\nGenerate content that:\n- Follows the platform rules and format\n- Uses the brand voice and tone\n- Includes relevant value propositions\n- Engages the target audience\n- Drives action through effective CTA\n- Uses ONLY Korean language (한국어만 사용)\n- Provides specific, concrete details rather than generic descriptions\n- Includes actual menu items, prices, locations, or specific features when mentioned\n- Creates authentic, believable content based on the provided information\n- If web search results are provided, use them to create richer, more factual content`
  );

  return sections.join('\n\n');
}

/**
 * 블로그용 상세 프롬프트 생성 (1,500자 이상 버전)
 */
const BLOG_INDUSTRY_HASHTAG_SEED_MAP: Record<string, string[]> = {
  food: ['맛집', '식당', '외식', '맛스타그램', '데이트코스', '점심특선', '가족외식', '파스타', '피자', '스테이크', '분식'],
  beauty: ['뷰티', '미용실', '네일아트', '컷트', '펌', '컬러', '헤어스타일', '메이크업', '피부관리', '에스테틱', '뷰티트렌드'],
  retail: ['신상품', '할인', '무료배송', '한정수량', '특가', '리뷰', '구매후기', '생활용품', '홈데코', '재고', '배송'],
  cafe: ['카페', '브런치', '디저트', '로스팅', '커피', '원두', '수제케이크', '오늘의카페', '테이크아웃', '디저트맛집'],
  fitness: ['PT', '다이어트', '헬스', '운동', '체형교정', '인바디', '식단', '헬스장', '러닝', '근력운동'],
  pet: ['펫샵', '그루밍', '노즈워크', '반려동물', '훈련', '강아지', '고양이', '케어', '안전', '픽업가능'],
  education: ['학원', '과외', '입시', '영어회화', '수학', '스터디', '초등', '중등', '고등', '성인교육'],
};

// 업종 유형: product(상품판매) vs service(서비스업)
// - retail만 product로 보고, 나머지는 service로 간주합니다.
const BLOG_INDUSTRY_TYPE_MAP: Record<string, 'product' | 'service'> = {
  retail: 'product',
  food: 'service',
  beauty: 'service',
  cafe: 'service',
  fitness: 'service',
  pet: 'service',
  education: 'service',
};

function createBlogPrompt(
  content: {
    notes?: string;
    keywords?: string[];
    imageCaptions?: string[];
    region?: string;
    link?: string;
  },
  domain: DomainProfile,
  brand?: { name: string; tone?: string; keywords?: string[]; voiceHints?: string[] },
  contact?: { phoneNumber?: string; kakaoChannel?: string }
): string {
  const sections: string[] = [];

  sections.push(`[CONTENT]

아래 입력값을 바탕으로 **800~1,200자** 분량의 네이버 블로그 글을 생성하라.
글이 1,200자를 넘지 않도록 내용을 압축하고, 불필요한 반복/군더더기를 제거하라.`);

  // 입력값 정리
  sections.push(`\n## 입력값\n`);
  
  sections.push(`**업종(type):** ${domain.id}`);

  const industryType = BLOG_INDUSTRY_TYPE_MAP[domain.id] || 'service';

  const industrySeeds = BLOG_INDUSTRY_HASHTAG_SEED_MAP[domain.id] || domain.hashtagSeeds || [];
  if (industrySeeds.length > 0) {
    sections.push(`**업종 해시태그 시드(우선 후보):** ${industrySeeds.join(', ')}`);
  }
  
  if (brand?.name) {
    sections.push(`**서비스·제품명(name):** ${brand.name}`);
  }
  
  if (content.keywords && content.keywords.length > 0) {
    sections.push(`**강조 포인트(keypoints):** ${content.keywords.join(', ')}`);
  }
  
  if (domain.valueProps && domain.valueProps.length > 0) {
    sections.push(`**고객이 얻는 이점(benefits):** ${domain.valueProps.join(', ')}`);
  }
  
  if (content.notes) {
    sections.push(`**상황 설명(context):** ${content.notes}`);
  }
  
  if (content.region) {
    sections.push(`**지역 정보:** ${content.region}`);
  }
  
  // 신뢰 포인트는 도메인의 compliance notes나 entities에서 추출
  const trustPoints: string[] = [];
  if (domain.complianceNotes && domain.complianceNotes.length > 0) {
    const baseTrust = domain.complianceNotes.slice(0, 3);
    // 서비스업에서는 재고/배송/환불/교환 관련 문구가 신뢰 포인트로 들어가지 않게 제거
    const filteredTrust =
      industryType === 'service'
        ? baseTrust.filter((n) => !/(재고|배송|환불|교환)/.test(n))
        : baseTrust;
    trustPoints.push(...filteredTrust);
  }
  if (domain.entities && domain.entities.length > 0) {
    const ent = domain.entities[0];
    const shouldPushEntity = industryType === 'service' ? !/(재고|배송|환불|교환)/.test(ent) : true;
    if (shouldPushEntity) {
      trustPoints.push(`전문적인 ${ent} 관리`);
    }
  }
  if (trustPoints.length > 0) {
    sections.push(`**신뢰 포인트(trust_point):** ${trustPoints.join(', ')}`);
  }

  // 서비스업에서는 상품판매용 섹션을 절대 생성하지 말 것
  if (industryType === 'service') {
    sections.push(
      `\n[금지: 서비스업 전용]\n` +
        `아래 항목은 "상품 판매용(쇼핑몰용) 섹션"이므로 **서비스업 블로그에서는 절대 생성하지 마라**.\n` +
        `- 재고 및 배송 정보\n` +
        `- 재고/배송\n` +
        `- 환불 및 교환 정책\n` +
        `- 환불/교환\n` +
        `- (배송/주문/반품/교환/재고 관련 문장)\n` +
        `대신 "이용/예약/문의/상담/진행 과정" 중심으로 설명하라.`
    );
  }
  
  // CTA 문구
  const rawCtaText =
    domain.sampleCTAs && domain.sampleCTAs.length > 0 ? domain.sampleCTAs[0] : '편하게 문의 주시면 자세히 안내드릴게요.';

  // 서비스업 업종인데도 "구매/할인/배송" 같은 쇼핑몰 CTA가 섞이면 상담 유도 문구로 자동 치환
  const serviceCtaFallbacks = [
    '편하게 문의 주시면 상황에 맞춰 자세히 안내드릴게요.',
    '궁금한 점은 편하게 연락 주시면 빠르게 상담 도와드릴게요.',
    '예약/상담 문의는 부담 없이 연락 주세요. 친절히 안내드리겠습니다.',
  ];
  const looksLikeShoppingCTA = /(구매|주문|장바구니|무료\s*배송|배송|특가|할인|쿠폰|🛍️|🚚)/;
  const ctaText =
    industryType === 'service' && looksLikeShoppingCTA.test(rawCtaText)
      ? serviceCtaFallbacks[0]
      : rawCtaText;
  sections.push(`**CTA 문구(cta_text):** ${ctaText}`);

  const contactLines: string[] = [];
  if (contact?.phoneNumber) contactLines.push(`전화: ${contact.phoneNumber}`);
  if (contact?.kakaoChannel) contactLines.push(`카카오 채널: ${contact.kakaoChannel}`);
  if (contactLines.length > 0) {
    sections.push(`**연락처 안내(contact):** ${contactLines.join(' / ')}`);
  }
  
  if (content.link) {
    sections.push(`**URL(url):** ${content.link}`);
  }

  // 이미지 설명
  if (content.imageCaptions && content.imageCaptions.length > 0) {
    sections.push(`\n**이미지 설명:**`);
    content.imageCaptions.forEach((caption, index) => {
      sections.push(`${index + 1}. ${caption}`);
    });
  }

  // 출력 규칙
  sections.push(`\n## 출력 규칙

**1. 첫 문단(후킹):** 2~4줄로 독자가 공감하거나 궁금해지는 상황을 제시한다.

**2. 서비스/제품 소개:** 업종(${domain.id})에 맞는 표현으로 특징과 장점을 설명한다.

**3. 고객의 상황·문제 묘사:** 왜 이 서비스/제품이 필요한지, 어떤 고민을 해결해 주는지 구체적으로 풀어 쓴다.

**4. 해결·이점 설명:** benefits를 중심으로 실제로 무엇이 좋아지는지, 어떤 경험을 하게 되는지 적는다.

**5. 신뢰 포인트:** trust_point를 자연스럽게 녹여서, 운영 방식·전문성·후기·관리 방식 등을 설명한다.

**6. 활용 팁·예시:** 실제 사용 상황, 추천 조합, 전/후 비교, 자주 받는 질문 등을 예시로 덧붙여 분량을 채운다.

**7. 분량:** 전체 글은 **800~1,200자** 사이로 작성한다. 1,200자를 넘지 마라.

**8. 형식:** 문단 사이에 한 줄 공백을 넣어 가독성을 높인다.
**8-1. 해시태그 출력 규칙:** 본문에는 해시태그(#...)를 절대 포함하지 않는다.
**8-2. 해시태그 마커:** 마지막에 아래 마커를 그대로 출력한 뒤, 마커 아래 1줄로만 해시태그를 출력한다.
마커 직전(마지막 문단/CTA 문단)에는 반드시 CTA 문구(cta_text)를 포함해라. 연락처(contact)가 있으면 함께 포함해라.

[[HASHTAGS]]
#tag1 #tag2 ... (총 10~15개, 공백으로 구분)

**8-3. 해시태그 생성 규칙:**
- 해시태그는 본문에서 실제로 등장한 핵심 정보(메뉴/가격/지역/특징/상황/키워드)를 근거로 생성한다.
- 후보는 업종 해시태그 시드(우선 후보)와 본문 근거를 함께 반영하되, 업종과 무관한 태그는 금지한다.
- 블랙리스트 단어는 해시태그로 절대 사용하지 마라: 쇼핑, 패션, 스타일, 옷, 의류, 액세서리, 쇼핑스타그램, ootd.

**9. 마무리(결론 및 CTA):** 마지막 문단(CTA 문단)에 반드시 CTA 문구(cta_text)를 포함해라. 연락처(contact)가 있으면 함께 포함해라.
URL(link)이 있으면 반드시 "링크 및 참고 자료: <URL>" 형태로 함께 포함해라.
CTA 문단은 2~3문장 이내로 짧고 자연스럽게(문의/예약 유도 중심) 작성해라.

**10. 어투:** 친근한 구어체이되, 너무 가볍지 않게 정보와 신뢰를 함께 전달한다.

**11. 언어:** 반드시 한국어만 사용한다. 일본어, 중국어 등 다른 언어는 절대 사용하지 않는다.

**12. 구체성:** 일반적인 설명보다 구체적인 메뉴명, 가격, 특징, 경험 등 실제 정보를 포함한다.`);

  // 도메인별 필수/금지 구문
  if (domain.mandatoryPhrases && domain.mandatoryPhrases.length > 0) {
    sections.push(`\n**필수 사용 구문:** ${domain.mandatoryPhrases.join(', ')}`);
  }
  
  if (domain.bannedPhrases && domain.bannedPhrases.length > 0) {
    sections.push(`\n**금지 구문 (절대 사용 금지):** ${domain.bannedPhrases.join(', ')}`);
  }

  return sections.join('\n');
}

/**
 * Threads용 상세 프롬프트 생성 (메인 글 + 댓글 3개)
 */
function createThreadsPrompt(
  content: {
    notes?: string;
    keywords?: string[];
    imageCaptions?: string[];
    region?: string;
    link?: string;
  },
  domain: DomainProfile,
  brand?: { name: string; tone?: string; keywords?: string[]; voiceHints?: string[] }
): string {
  const sections: string[] = [];

  sections.push(`[CONTENT]

아래 입력값을 바탕으로 **Threads 게시글 1세트(메인 글 + 댓글 3개)**를 생성하라.`);

  // 입력값 정리
  sections.push(`\n## 입력값\n`);
  
  sections.push(`**업종(type):** ${domain.id}`);
  
  if (brand?.name) {
    sections.push(`**서비스·제품명(name):** ${brand.name}`);
  }
  
  if (content.keywords && content.keywords.length > 0) {
    sections.push(`**강조 포인트(keypoints):** ${content.keywords.join(', ')}`);
  }
  
  if (domain.valueProps && domain.valueProps.length > 0) {
    sections.push(`**고객 이점(benefits):** ${domain.valueProps.join(', ')}`);
  }
  
  if (content.notes) {
    sections.push(`**상황 설명(context):** ${content.notes}`);
  }
  
  if (content.region) {
    sections.push(`**지역 정보:** ${content.region}`);
  }
  
  // 신뢰 포인트
  const trustPoints: string[] = [];
  if (domain.complianceNotes && domain.complianceNotes.length > 0) {
    trustPoints.push(...domain.complianceNotes.slice(0, 2));
  }
  if (domain.entities && domain.entities.length > 0) {
    trustPoints.push(`전문적인 ${domain.entities[0]} 관리`);
  }
  if (trustPoints.length > 0) {
    sections.push(`**신뢰 포인트(trust_point):** ${trustPoints.join(', ')}`);
  }
  
  // CTA 문구
  const ctaText = domain.sampleCTAs && domain.sampleCTAs.length > 0 
    ? domain.sampleCTAs[0] 
    : '지금 바로 확인해보세요!';
  sections.push(`**CTA 문구(cta_text):** ${ctaText}`);
  
  if (content.link) {
    sections.push(`**URL(url):** ${content.link}`);
  }

  // 이미지 설명
  if (content.imageCaptions && content.imageCaptions.length > 0) {
    sections.push(`\n**이미지 설명:**`);
    content.imageCaptions.forEach((caption, index) => {
      sections.push(`${index + 1}. ${caption}`);
    });
  }

  // 업종별 특화 가이드
  const domainGuidance: Record<string, string> = {
    food: '맛·식감 중심',
    beauty: '변화·개선 느낌',
    retail: '편의성·특징 강조',
    cafe: '풍미·분위기',
    fitness: '변화·동기 부여',
    pet: '케어·안전·신뢰',
    education: '성장·효과·동기',
  };

  const domainFocus = domainGuidance[domain.id] || '특징 강조';

  // 출력 규칙
  sections.push(`\n## 🎯 출력 규칙 (Threads 최적화)

### ◆ 메인 글

- 첫 문장은 1줄 강력 후킹
- 업종에 맞춘 감각적·직관적 문장 구성
  - ${domain.id} → ${domainFocus}
- keypoints + benefits를 자연스럽게 연결
- 신뢰 포인트(trust_point)를 1줄로 포함
- 마지막 문장은 사용자에게 질문 형태로 마무리
- 해시태그는 절대 사용하지 않는다.

### ◆ 댓글 1 — 업종 기반 신뢰 포인트 1~2줄

업종에 맞춘 짧고 신뢰 있는 설명을 작성한다.

예시 방향:
- food → 조리 과정·식재료 관리
- beauty → 위생·프로세스·전문성
- retail → 품질·내구성·실사용 후기
- cafe → 원두·제조 방식·시그니처 특징
- fitness → 운동 구성·코칭 방식
- pet → 전문 케어·안전성·꼼꼼함
- education → 학습 관리·프로그램 체계

### ◆ 댓글 2 — CTA 안내

- 자연스럽게 행동을 유도하는 한 문단
- cta_text + url 반드시 포함
- 예: "👉 예약하기: https://…"
- 예: "👉 자세히 보기: https://…"

### ◆ 댓글 3 — 저장·다음 콘텐츠 유도

1줄로 짧고 가벼운 문장

예시:
- "필요할 때 보려고 저장해두는 분들 많아요."
- "다음 소개할 내용도 기대해주세요!"
- "오늘 글, 저장해두면 나중에 도움 될 거예요."

## 🎯 출력 형식

반드시 아래 형식으로 출력하라:

메인 글:
(본문)

댓글 1:
(본문)

댓글 2:
(본문)

댓글 3:
(본문)

**중요:**
- 해시태그는 절대 사용하지 않는다.
- 한국어만 사용한다 (일본어, 중국어 등 다른 언어 절대 금지).
- 구체적인 메뉴명, 가격, 특징, 경험 등 실제 정보를 포함한다.
- 일반적인 설명보다 구체적인 경험과 감각을 강조한다.`);

  // 도메인별 필수/금지 구문
  if (domain.mandatoryPhrases && domain.mandatoryPhrases.length > 0) {
    sections.push(`\n**필수 사용 구문:** ${domain.mandatoryPhrases.join(', ')}`);
  }
  
  if (domain.bannedPhrases && domain.bannedPhrases.length > 0) {
    sections.push(`\n**금지 구문 (절대 사용 금지):** ${domain.bannedPhrases.join(', ')}`);
  }

  return sections.join('\n');
}

/**
 * Instagram용 상세 프롬프트 생성
 */
function createInstagramPrompt(
  content: {
    notes?: string;
    keywords?: string[];
    imageCaptions?: string[];
    region?: string;
    link?: string;
  },
  domain: DomainProfile,
  brand?: { name: string; tone?: string; keywords?: string[]; voiceHints?: string[] }
): string {
  const sections: string[] = [];

  sections.push(`[CONTENT]

아래 입력값을 바탕으로 Instagram 게시글 1개를 생성하라.`);

  // 입력값 정리
  sections.push(`\n## 입력값\n`);
  
  sections.push(`**업종(type):** ${domain.id}`);
  
  if (brand?.name) {
    sections.push(`**서비스·제품명(name):** ${brand.name}`);
  }
  
  if (content.keywords && content.keywords.length > 0) {
    sections.push(`**강조 포인트(keypoints):** ${content.keywords.join(', ')}`);
  }
  
  if (domain.valueProps && domain.valueProps.length > 0) {
    sections.push(`**고객 이점(benefits):** ${domain.valueProps.join(', ')}`);
  }
  
  if (content.notes) {
    sections.push(`**상황 설명(context):** ${content.notes}`);
  }
  
  if (content.region) {
    sections.push(`**지역 정보:** ${content.region}`);
  }
  
  // 신뢰 포인트
  const trustPoints: string[] = [];
  if (domain.complianceNotes && domain.complianceNotes.length > 0) {
    trustPoints.push(...domain.complianceNotes.slice(0, 2));
  }
  if (domain.entities && domain.entities.length > 0) {
    trustPoints.push(`전문적인 ${domain.entities[0]} 관리`);
  }
  if (trustPoints.length > 0) {
    sections.push(`**신뢰 포인트(trust_point):** ${trustPoints.join(', ')}`);
  }
  
  // CTA 문구
  const ctaText = domain.sampleCTAs && domain.sampleCTAs.length > 0 
    ? domain.sampleCTAs[0] 
    : '지금 바로 확인해보세요!';
  sections.push(`**CTA 문구(cta_text):** ${ctaText}`);
  
  if (content.link) {
    sections.push(`**URL(url):** ${content.link}`);
  }

  // 이미지 설명
  if (content.imageCaptions && content.imageCaptions.length > 0) {
    sections.push(`\n**이미지 설명:**`);
    content.imageCaptions.forEach((caption, index) => {
      sections.push(`${index + 1}. ${caption}`);
    });
  }

  // 업종별 특화 가이드
  const domainGuidance: Record<string, string> = {
    food: '식감·향·맛',
    beauty: '변화·개선·관리',
    retail: '사용성·품질',
    cafe: '분위기·풍미',
    fitness: '변화·동기',
    pet: '케어·안전·사랑스러움',
    education: '성장·동기·학습 효과',
  };

  const domainFocus = domainGuidance[domain.id] || '특징 강조';

  // 출력 규칙
  sections.push(`\n## 🎯 출력 규칙 (Instagram 최신 알고리즘 대응)

### ◆ 본문 구성

**1) 강력한 2줄 후킹으로 시작**
- 짧고 명확하며 감각적이어야 한다.
- 업종(${domain.id})에 맞는 표현으로 후킹 자동 조정
  - ${domain.id} → ${domainFocus}

**2) 서비스/제품(name) 소개 + keypoints**
- 기능/특징/경험을 자연스럽고 간결하게 묘사
- 과장 금지, 신뢰 기반 표현 사용

**3) 고객이 얻는 이점(benefits) 강조**
- "이걸 선택하면 무엇이 좋아지는가?"
- 상황(context)과 연결하면 더 좋음

**4) trust_point 반드시 포함**
- 한 문장으로 자연스럽게 삽입
- 업종별 신뢰 요소가 어색하지 않게 배치

**5) CTA + URL**
- 가장 마지막 단락에 배치
- 예: "👉 자세히 보기: https://XXXX"
- 행동을 부드럽게 유도하는 문장 포함

**6) 본문 내 해시태그 금지**
- 인스타 최신 문법에 맞게 본문에는 # 사용하지 않는다.

### ◆ 해시태그 블록 생성 규칙

마지막에 해시태그만 별도의 단락으로 생성

구성:
- 업종(${domain.id})에 따른 기본 태그 1개
  - #food / #beauty / #retail / #cafe / #fitness / #pet / #education
- name, keypoints, benefits를 기반으로 자동 생성된 동적 해시태그 8~12개
- 총 해시태그 10~15개
- 중복·동의어 금지
- 영어/한국어 혼합 가능 (노출 확장 목적)

## 🎯 출력 형식

반드시 아래 형식으로 출력하라:

본문:
(여기에 인스타그램 글 전체)

해시태그:
#업종기본태그 #동적태그…

**중요:**
- 본문에는 해시태그를 절대 사용하지 않는다.
- 해시태그는 별도 블록으로만 생성한다.
- 한국어만 사용한다 (일본어, 중국어 등 다른 언어 절대 금지).
- 구체적인 메뉴명, 가격, 특징, 경험 등 실제 정보를 포함한다.
- 일반적인 설명보다 구체적인 경험과 감각을 강조한다.`);

  // 도메인별 필수/금지 구문
  if (domain.mandatoryPhrases && domain.mandatoryPhrases.length > 0) {
    sections.push(`\n**필수 사용 구문:** ${domain.mandatoryPhrases.join(', ')}`);
  }
  
  if (domain.bannedPhrases && domain.bannedPhrases.length > 0) {
    sections.push(`\n**금지 구문 (절대 사용 금지):** ${domain.bannedPhrases.join(', ')}`);
  }

  return sections.join('\n');
}

/**
 * Google My Business(GMB)용 상세 프롬프트 생성
 */
function createGMBPrompt(
  content: {
    notes?: string;
    keywords?: string[];
    imageCaptions?: string[];
    region?: string;
    link?: string;
  },
  domain: DomainProfile,
  brand?: { name: string; tone?: string; keywords?: string[]; voiceHints?: string[] }
): string {
  const sections: string[] = [];

  sections.push(`[CONTENT]

아래 입력값을 바탕으로 Google My Business(GMB) 게시글 1개를 생성하라.`);

  // 입력값 정리
  sections.push(`\n## 입력값\n`);
  
  sections.push(`**업종(type):** ${domain.id}`);
  
  if (brand?.name) {
    sections.push(`**서비스·제품명(name):** ${brand.name}`);
  }
  
  if (content.keywords && content.keywords.length > 0) {
    sections.push(`**강조 포인트(keypoints):** ${content.keywords.join(', ')}`);
  }
  
  if (domain.valueProps && domain.valueProps.length > 0) {
    sections.push(`**고객 이점(benefits):** ${domain.valueProps.join(', ')}`);
  }
  
  if (content.notes) {
    sections.push(`**상황 설명(context):** ${content.notes}`);
  }
  
  if (content.region) {
    sections.push(`**지역 정보:** ${content.region}`);
  }
  
  // 신뢰 포인트
  const trustPoints: string[] = [];
  if (domain.complianceNotes && domain.complianceNotes.length > 0) {
    trustPoints.push(...domain.complianceNotes.slice(0, 2));
  }
  if (domain.entities && domain.entities.length > 0) {
    trustPoints.push(`전문적인 ${domain.entities[0]} 관리`);
  }
  if (trustPoints.length > 0) {
    sections.push(`**신뢰 포인트(trust_point):** ${trustPoints.join(', ')}`);
  }
  
  // CTA 문구
  const ctaText = domain.sampleCTAs && domain.sampleCTAs.length > 0 
    ? domain.sampleCTAs[0] 
    : '지금 바로 확인해보세요!';
  sections.push(`**CTA 문구(cta_text):** ${ctaText}`);
  
  if (content.link) {
    sections.push(`**URL(url):** ${content.link}`);
  }

  // 이미지 설명
  if (content.imageCaptions && content.imageCaptions.length > 0) {
    sections.push(`\n**이미지 설명:**`);
    content.imageCaptions.forEach((caption, index) => {
      sections.push(`${index + 1}. ${caption}`);
    });
  }

  // 업종별 특화 가이드
  const domainGuidance: Record<string, string> = {
    food: '맛·식감·만족감 중심의 설명',
    beauty: '개선·변화·관리 과정 중심',
    retail: '기능·사용성·편의성 중심',
    cafe: '공간감·분위기·풍미 강조',
    fitness: '변화·목표 달성·전문 가이드 강조',
    pet: '케어·안전·맞춤 관리·안심 요소',
    education: '학습 효과·성장·체계성 강조',
  };

  const domainFocus = domainGuidance[domain.id] || '특징 강조';

  // 출력 규칙
  sections.push(`\n## 🎯 출력 규칙 (Google My Business 최적화)

### ◆ 본문 구성 (200~350자)

**1) 1~2줄 후킹**
- 짧고 명확하게 시작

**2) 서비스·제품(name) 소개**
- 간결하고 명확하게

**3) keypoints를 간단하고 명확하게 표현**
- 핵심만 간결하게

**4) benefits를 "고객이 실제로 얻게 되는 변화" 중심으로 정의**
- 구체적인 변화와 이점 강조

**5) trust_point를 짧게 포함**
- 한 문장으로 자연스럽게

**6) 지역 기반 플랫폼 특성에 맞춰 "방문, 문의, 이용"과 같은 어휘 자연스럽게 활용**
- GMB는 지역 기반 검색 플랫폼이므로 방문, 문의, 이용 등의 어휘를 자연스럽게 사용

**7) 마지막 줄에는 CTA 문구 + URL을 반드시 넣는다**
- 예: "👉 예약하기: https://XXXX"
- 예: "👉 자세히 보기: https://XXXX"

**8) 해시태그는 사용하지 않는다**

**9) 불필요한 말풍선/이모지는 최소화, 정보 중심 톤 유지**
- 이모지는 최대 1~2개만 사용
- 정보 중심의 전문적인 톤 유지

### 🎯 업종별 핵심 문장 스타일 자동 적용 규칙

이 규칙은 자동으로 문장에 녹아들어야 한다:

- food → 맛·식감·만족감 중심의 설명
- beauty → 개선·변화·관리 과정 중심
- retail → 기능·사용성·편의성 중심
- cafe → 공간감·분위기·풍미 강조
- fitness → 변화·목표 달성·전문 가이드 강조
- pet → 케어·안전·맞춤 관리·안심 요소
- education → 학습 효과·성장·체계성 강조

현재 업종(${domain.id})에 맞는 스타일: ${domainFocus}

## 🎯 출력 형식

반드시 아래 형식으로 출력하라:

GMB 게시글:
(본문 200~350자)

CTA + URL

**중요:**
- 분량은 반드시 200~350자 사이로 작성한다.
- 해시태그는 절대 사용하지 않는다.
- 이모지는 최소화(1~2개 이내)하고 정보 중심 톤을 유지한다.
- 한국어만 사용한다 (일본어, 중국어 등 다른 언어 절대 금지).
- 구체적인 메뉴명, 가격, 특징, 경험 등 실제 정보를 포함한다.
- 지역 기반 플랫폼 특성에 맞춰 "방문, 문의, 이용" 등의 어휘를 자연스럽게 활용한다.`);

  // 도메인별 필수/금지 구문
  if (domain.mandatoryPhrases && domain.mandatoryPhrases.length > 0) {
    sections.push(`\n**필수 사용 구문:** ${domain.mandatoryPhrases.join(', ')}`);
  }
  
  if (domain.bannedPhrases && domain.bannedPhrases.length > 0) {
    sections.push(`\n**금지 구문 (절대 사용 금지):** ${domain.bannedPhrases.join(', ')}`);
  }

  return sections.join('\n');
}

/**
 * 이미지 분석을 위한 프롬프트 생성 (Vision 전처리)
 * @param domain - 도메인 프로필
 * @param notes - 사용자 메모 (선택사항)
 * @returns 이미지 분석 프롬프트
 */
export function createImageAnalysisPrompt(domain: DomainProfile, notes?: string): string {
  const parts: string[] = [
    'Analyze the provided image and create a detailed alt-text-like caption that describes:',
    '1. Main subjects and objects visible',
    '2. Colors, lighting, and overall mood',
    '3. Composition and visual style',
    '4. Any text or signs visible',
    '5. Overall impression and emotions evoked',
  ];

  // 도메인별 강조점
  if (domain.entities && domain.entities.length > 0) {
    parts.push(`\nFocus especially on these entities relevant to ${domain.id} industry:`);
    domain.entities.slice(0, 5).forEach((entity) => {
      parts.push(`- ${entity}`);
    });
  }

  if (notes) {
    parts.push(`\nUser context: ${notes}`);
  }

  parts.push(
    '\nReturn a concise, descriptive caption (2-3 sentences) that can be used to generate marketing content.'
  );

  return parts.join('\n');
}
