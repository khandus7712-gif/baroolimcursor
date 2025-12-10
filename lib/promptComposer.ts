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

  // [CONTENT] 섹션
  sections.push(createContentSection(input.content, input.domain, input.platform, input.brand));

  return sections.join('\n\n');
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
  brand?: { name: string; tone?: string; keywords?: string[]; voiceHints?: string[] }
): string {
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
    return createBlogPrompt(content, domain, brand);
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
function createBlogPrompt(
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

아래 입력값을 바탕으로 **1,500자 이상(권장 1,800~2,200자)**의 네이버 블로그 글을 생성하라.`);

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
    trustPoints.push(...domain.complianceNotes.slice(0, 3));
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

  // 출력 규칙
  sections.push(`\n## 출력 규칙

**1. 첫 문단(후킹):** 2~4줄로 독자가 공감하거나 궁금해지는 상황을 제시한다.

**2. 서비스/제품 소개:** 업종(${domain.id})에 맞는 표현으로 특징과 장점을 설명한다.

**3. 고객의 상황·문제 묘사:** 왜 이 서비스/제품이 필요한지, 어떤 고민을 해결해 주는지 구체적으로 풀어 쓴다.

**4. 해결·이점 설명:** benefits를 중심으로 실제로 무엇이 좋아지는지, 어떤 경험을 하게 되는지 적는다.

**5. 신뢰 포인트:** trust_point를 자연스럽게 녹여서, 운영 방식·전문성·후기·관리 방식 등을 설명한다.

**6. 활용 팁·예시:** 실제 사용 상황, 추천 조합, 전/후 비교, 자주 받는 질문 등을 예시로 덧붙여 분량을 채운다.

**7. 분량:** 전체 글은 반드시 1,500자 이상이 되도록 작성하고, 가능하면 1,800~2,200자 사이를 목표로 한다.

**8. 형식:** 문단 사이에 한 줄 공백을 넣어 가독성을 높인다. 해시태그는 사용하지 않는다.

**9. 마무리:** 마지막 문단에 자연스럽게 CTA 문구(cta_text)와 URL(url)을 넣어 행동을 유도한다.

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
