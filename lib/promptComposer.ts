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

  // 블로그 플랫폼일 때 최소 글자 수를 먼저 강조
  if (platform.id === 'blog') {
    sections.push(
      `\n**⚠️ 중요: 블로그 콘텐츠는 반드시 최소 1500자 이상(공백 제외) 작성해야 합니다.**\n- 충분한 본문 내용으로 독자에게 가치 있는 정보를 제공하세요\n- 여러 섹션과 소제목을 활용하여 내용을 풍부하게 구성하세요\n- 각 섹션마다 상세한 설명과 예시를 포함하세요`
    );
  }

  sections.push(
    `\nGenerate content that:\n- Follows the platform rules and format\n- Uses the brand voice and tone\n- Includes relevant value propositions\n- Engages the target audience\n- Drives action through effective CTA`
  );

  // 블로그 플랫폼일 때 가독성 강조 및 최소 글자 수 요구
  if (platform.id === 'blog') {
    sections.push(
      `\n**블로그 콘텐츠 필수 요구사항:**\n- **최소 1500자 이상 작성 필수** (공백 제외)\n- 모든 단락 사이에 빈 줄(\\n\\n) 삽입\n- 소제목(##) 전후로 빈 줄 2개씩 삽입\n- 각 단락은 2-4문장으로 간결하게\n- 긴 텍스트 블록 금지\n- 목록 사용 시 각 항목 간 공백 유지\n- 충분한 본문 내용으로 독자에게 가치 있는 정보 제공\n- 여러 섹션과 소제목을 활용하여 내용을 풍부하게 구성`
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
