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
  sections.push(createContentSection(input.content, input.domain, input.platform));

  return sections.join('\n\n');
}

/**
 * [SYSTEM] 섹션 생성
 */
function createSystemSection(domain: DomainProfile): string {
  return `[SYSTEM]

You are an expert marketing content writer specializing in the ${domain.id} industry.

**CRITICAL LANGUAGE REQUIREMENT: 
- Write ALL content ONLY in Korean (한국어)
- Do NOT use English words, phrases, or sentences anywhere in the content
- Do NOT include English translations in parentheses
- Use Korean translations for all concepts
- Examples: Use "맛집" instead of "restaurant", "맛있는" instead of "delicious", "추천" instead of "recommend"
- If you need to describe technical terms, use Korean equivalents only**

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
  const minChars = platform.id === 'blog' ? 1500 : undefined;

  return `[PLATFORM_RULES]

Platform: ${platform.id}
${minChars ? `Minimum Characters: ${minChars} (REQUIRED - content must be at least ${minChars} characters)` : ''}
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
  platform: PlatformTemplate
): string {
  const sections: string[] = ['[CONTENT]\n\nCreate marketing content with the following information:'];

  // 이미지 캡션 (Vision 전처리 결과)
  if (content.imageCaptions && content.imageCaptions.length > 0) {
    sections.push('Image Descriptions (use as reference only, do NOT include labels like "Caption:" or "**Caption:**" in the final content):');
    content.imageCaptions.forEach((caption, index) => {
      sections.push(`${index + 1}. ${caption}`);
    });
    if (platform.id === 'blog') {
      sections.push(
        '**중요:** 이미지 설명을 참고하여 본문에 자연스럽게 이미지 내용을 녹여내세요. 하지만 "Caption:", "**Caption:**", "이미지 설명:" 같은 라벨이나 표시를 본문에 포함하지 마세요. 이미지에 대한 설명은 본문의 자연스러운 문장 속에 포함시키세요.'
      );
    } else {
      sections.push(
        'Use these image descriptions to create visually-rich storytelling. Reference the images naturally in the content.'
      );
    }
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

  // 블로그 플랫폼일 때 최소 글자 수를 먼저 강조
  if (platform.id === 'blog') {
    sections.push(
      `\n**⚠️ 중요: 블로그 콘텐츠는 반드시 최소 1500자 이상(공백 제외) 작성해야 합니다.**\n- 충분한 본문 내용으로 독자에게 가치 있는 정보를 제공하세요\n- 여러 섹션과 소제목을 활용하여 내용을 풍부하게 구성하세요\n- 각 섹션마다 상세한 설명과 예시를 포함하세요`
    );
  }

  sections.push(
    `\nGenerate content that:\n- **Write ONLY in Korean (한국어). Do NOT use any English words, phrases, or sentences. Do NOT include English translations in parentheses.**\n- Follows the platform rules and format\n- Uses the brand voice and tone\n- Includes relevant value propositions\n- Engages the target audience\n- Drives action through effective CTA`
  );

  // 블로그 플랫폼일 때 가독성 강조 및 최소 글자 수 요구
  if (platform.id === 'blog') {
    sections.push(
      `\n**블로그 콘텐츠 필수 규칙:**\n1. **모든 내용은 반드시 한국어로만 작성하세요.**\n2. **최소 1500자 이상 작성 필수** (공백 제외).\n3. **제목(H1)** 은 '메뉴/서비스 + 상황 + 지역 + 강력 키워드' 중 최소 2개를 조합하세요 (예: "창원 연말 회식은 전골+육전 조합이 답입니다").\n4. **첫 단락(Hook)** 은 문제·경쟁·위험·시즌 중 하나를 반드시 포함하여 강하게 시작하세요 (예: "연말 모임은 메뉴 실패하면 분위기가 망합니다.").\n5. **USP(장점)** 은 글 상단 20~30% 안에 몰아서 3회 이상 강조하되, 문장 형태를 모두 다르게 변형하세요 (예: "매일 삶아 깊은 국물", "위생 관리 철저", "겉바속촉 육전").\n6. 설명형 문단은 3문장 이하로 제한하여 가독성을 유지하세요.\n7. 중간에 감각 묘사(향·온도·식감)를 최소 2회 넣어 몰입도를 높이세요.\n8. 마지막 CTA는 즉시성·희소성 기반으로 작성하세요 (예: "자리 빨리 찹니다. 지금 바로 예약하세요.").\n9. 해시태그는 메뉴 + 지역 + 상황 중심으로 10~15개만 작성하고, 의미 없는 일반 태그(#맛있는, #카페 등)는 사용하지 마세요.\n10. 모든 단락 사이에 빈 줄(\\n\\n) 삽입, 소제목(##) 전후로 빈 줄 2개씩 삽입, 각 단락은 2-4문장으로 간결하게 유지하세요.\n11. 긴 텍스트 블록 금지, 정보형 + 설득형의 균형을 유지하고, 중복 문장은 허용되지 않습니다.\n12. **섹션 제목** 은 '도입부', '본문', '결론' 같은 일반적인 단어 대신 내용에 맞는 자연스러운 제목을 사용하세요 (예: '아롱하다의 특별한 메뉴', '맛의 비밀', '위치 및 예약 안내').\n13. **이미지 설명** 을 본문에 포함할 때 'Caption:' 등의 라벨 없이 자연스러운 문장으로 녹여내세요.`
    );
  }

  // 인스타그램 플랫폼 규칙
  if (platform.id === 'instagram') {
    sections.push(
      `\n**인스타그램 필수 규칙:**\n1. 첫 문장은 반드시 강력한 Hook으로 시작하세요 (고객 고민/상황/계절/희소성 기반, 예: \"연말 회식 메뉴 고민되세요?\").\n2. 두 번째 문장에는 고객 Pain Point를 넣으세요 (예: \"단체 예약 찾기 어렵다는 얘기 많죠?\").\n3. USP(장점)는 글 상단 30% 안에 3회 이상 강조하되, 문장 형태를 모두 다르게 변형하세요 (예: \"매일 삶아 깊은 국물\", \"위생 관리 철저\", \"신선한 재료\").\n4. 문장은 짧고 리듬감 있게 1~2줄로 구성하고 설명형 문단은 금지입니다.\n5. CTA는 즉시성·희소성을 반드시 포함하세요 (예: \"자리 빨리 찹니다. 미리 예약 주세요.\").\n6. 해시태그는 지역 + 메뉴 + 상황 중심으로 10~15개만 작성하고, 의미 없는 일반 태그(#foodie, #맛있는 등)는 사용하지 마세요.\n7. 이모지는 문장 1개당 1개 이하로만 사용하세요.`
    );
  }

  if (platform.id === 'threads') {
    sections.push(
      `\n**Threads 댓글형 Reply Chain 규칙:**\n1. 본글은 2~3줄만 작성하고, 첫 문장은 문제·위험·경쟁·시즈널 이슈 중 하나를 활용해 강력한 Hook으로 시작하세요.\n2. 첫 번째 댓글에는 Pain Point 1개와 USP 1개만 짧게 담으세요 (예: \"단체로 가면 양·맛·위생 걱정 많죠?\" → \"아롱하다는 매일 삶고 육수·냄비까지 매일 살균합니다\").\n3. 두 번째 댓글(대댓글)은 즉시성·희소성을 강조한 CTA로 마무리하세요 (예: \"오늘도 점심 자리 빠르게 마감 중입니다. 지금 예약하세요!\").\n4. 각 줄은 하나의 메시지만 전달하고, 대화하듯 리듬감 있는 톤을 유지하세요.\n5. 해시태그는 업종 + 지역 + 메뉴 + 상황 중심으로 3~6개만 작성하고, 의미 없는 일반 태그(#foodie, #맛있는 등)는 사용하지 마세요.`
    );
  }

  return sections.join('\n\n');
}

/**
 * 이미지 분석을 위한 프롬프트 생성 (Vision 전처리)
 * @param domain - 도메인 프로필
 * @param notes - 사용자 메모 (선택사항)
 * @returns 이미지 분석 프롬프트
 */
export function createImageAnalysisPrompt(domain: DomainProfile, notes?: string): string {
  const parts: string[] = [
    '**중요: 모든 설명은 한국어로만 작성하세요. 영어를 사용하지 마세요.**',
    '제공된 이미지를 분석하고 다음을 설명하는 상세한 alt-text 형식의 캡션을 한국어로 작성하세요:',
    '1. 보이는 주요 대상과 객체',
    '2. 색상, 조명, 전체적인 분위기',
    '3. 구도와 시각적 스타일',
    '4. 보이는 텍스트나 표지판',
    '5. 전체적인 인상과 감정',
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
