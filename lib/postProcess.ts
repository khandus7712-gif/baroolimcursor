/**
 * Post Processor
 * 생성된 콘텐츠를 후처리 (금칙어 필터링, mustInclude 체크, 해시태그 생성)
 */

import type { DomainProfile } from '@/types/domain';
import type { PlatformTemplate } from '@/types/platform';

/**
 * 후처리 옵션
 */
export interface PostProcessOptions {
  domain: DomainProfile;
  platform: PlatformTemplate;
  region?: string;
  keywords?: string[];
  menuNames?: string[];
  intent?: string[];
  link?: string;
}

/**
 * 후처리 결과
 */
export interface PostProcessResult {
  output: string;
  hashtags: string[];
  warnings: string[];
}

// 블로그에서 업종과 무관하게 섞이는 태그를 제거하기 위한 블랙리스트
// (postProcess 단계에서 태그 문자열 단위로 필터링)
const BLOG_HASHTAG_BLACKLIST = [
  '쇼핑',
  '패션',
  '스타일',
  '옷',
  '의류',
  '액세서리',
  '쇼핑스타그램',
  'ootd',
] as const;

// 업종 유형: product(상품판매) vs service(서비스업)
const BLOG_INDUSTRY_TYPE_MAP: Record<string, 'product' | 'service'> = {
  retail: 'product',
  food: 'service',
  beauty: 'service',
  cafe: 'service',
  fitness: 'service',
  pet: 'service',
  education: 'service',
};

function isServiceBlogDomain(domainId: string): boolean {
  return (BLOG_INDUSTRY_TYPE_MAP[domainId] || 'service') === 'service';
}

function filterServiceProductSections(text: string): { text: string; removed: boolean } {
  // 서비스업 블로그에서 금지할 키워드(재고/배송/환불/교환)
  const banned = /(재고|배송|환불|교환)/;
  const lines = text.split('\n');
  let removed = false;
  const kept = lines.filter((line) => {
    const hit = banned.test(line);
    if (hit) removed = true;
    return !hit;
  });
  const cleaned = kept.join('\n').replace(/\n{3,}/g, '\n\n');
  return { text: cleaned, removed };
}

function normalizeServiceBlogCTA(text: string): { text: string; changed: boolean } {
  // 서비스업 블로그에서 쇼핑몰형 CTA(구매/할인/장바구니/🛍️ 등)가 마지막에 붙는 케이스 방어
  const shoppingCTA = /지금\s*구매하시고\s*특별한\s*할인\s*혜택을\s*받아보세요!\s*🛍️?/g;
  const otherShoppingSignals = /(장바구니|무료\s*배송|지금\s*주문|특가|쿠폰|할인\s*혜택|🛍️|🚚)/;

  let changed = false;
  let out = text;

  if (shoppingCTA.test(out)) {
    out = out.replace(shoppingCTA, '편하게 문의 주시면 상황에 맞춰 자세히 안내드릴게요.');
    changed = true;
  } else if (otherShoppingSignals.test(out)) {
    // 문서 전체를 과하게 바꾸지 않도록: 마지막 400자 내에서만 치환 시도
    const tailLen = 400;
    const head = out.slice(0, Math.max(0, out.length - tailLen));
    const tail = out.slice(Math.max(0, out.length - tailLen));
    if (otherShoppingSignals.test(tail)) {
      const cleanedTail = tail
        .replace(/지금\s*구매[^\n]*?(🛍️|🚚)?/g, '편하게 문의 주세요. 빠르게 안내드릴게요.')
        .replace(/장바구니[^\n]*?/g, '문의 주시면 안내드릴게요.')
        .replace(/무료\s*배송[^\n]*?(🚚)?/g, '문의 주시면 안내드릴게요.')
        .replace(/오늘만\s*특가[^\n]*?/g, '문의 주시면 안내드릴게요.');
      if (cleanedTail !== tail) {
        out = head + cleanedTail;
        changed = true;
      }
    }
  }

  return { text: out, changed };
}

function filterBlogHashtags(hashtags: string[], platform: PlatformTemplate): string[] {
  if (platform.id !== 'blog') return hashtags;

  const exact = new Set(BLOG_HASHTAG_BLACKLIST.map((t) => t.toLowerCase()));
  const substrings = BLOG_HASHTAG_BLACKLIST.map((t) => t.toLowerCase());

  return hashtags.filter((tag) => {
    const normalized = String(tag).toLowerCase().trim();
    if (!normalized) return false;
    if (exact.has(normalized)) return false;
    // 예: ootd/ootd스타일 같은 변형도 제거
    if (substrings.some((b) => normalized.includes(b))) return false;
    return true;
  });
}

type BlogHashtagExtraction = {
  tags: string[];
  cleanedText: string;
};

/**
 * 블로그용: AI가 [[HASHTAGS]] 마커로 출력한 해시태그를 추출
 * - marker가 없으면 tags: [] 반환
 * - marker 포함 이후 내용을 output에서 제거
 */
function extractBlogHashtagsFromText(text: string): BlogHashtagExtraction {
  const marker = '[[HASHTAGS]]';
  const idx = text.indexOf(marker);
  if (idx === -1) {
    return { tags: [], cleanedText: text };
  }

  // marker는 제거하되, CTA처럼 marker 뒤에 이어서 작성된 본문은 최대한 보존한다.
  const before = text.slice(0, idx).trimEnd();
  const after = text.slice(idx + marker.length);

  // marker 이후에서 #태그 형태(또는 #이 없는 단어) 후보를 최대한 추출
  // - prompt에서 #을 포함하도록 강제하지만, 방어적으로 처리
  const tokens = after.match(/#?[가-힣A-Za-z0-9_]+/g) ?? [];
  const normalizedTags = tokens
    .map((t) => t.trim())
    .map((t) => (t.startsWith('#') ? t.slice(1) : t))
    .map((t) => t.replace(/[^가-힣A-Za-z0-9_]/g, '').toLowerCase())
    .filter((t) => t.length > 0);

  // 중복 제거(순서 유지)
  const seen = new Set<string>();
  const uniqueTags: string[] = [];
  for (const t of normalizedTags) {
    if (!seen.has(t)) {
      seen.add(t);
      uniqueTags.push(t);
    }
  }

  // after에서 "마커 다음의 해시태그(또는 빈줄) 시작 구간"만 제거하고,
  // 그 다음에 CTA가 있으면 유지한다.
  const afterLines = after.split(/\r?\n/);
  let cursor = 0;
  while (cursor < afterLines.length) {
    const line = afterLines[cursor].trim();
    // 빈 줄 / 해시태그 라인으로 시작하는 구간은 제거
    if (line === '') {
      cursor++;
      continue;
    }
    if (line.startsWith('#')) {
      cursor++;
      continue;
    }
    break;
  }

  const remaining = afterLines.slice(cursor).join('\n').trimEnd();
  const cleanedText = remaining ? `${before}\n${remaining}` : before;

  return { tags: uniqueTags, cleanedText };
}

/**
 * 후처리 실행
 * @param text - 원본 텍스트
 * @param options - 후처리 옵션
 * @returns 후처리된 결과
 */
export async function runPostProcess(text: string, options: PostProcessOptions): Promise<PostProcessResult> {
  const warnings: string[] = [];
  let processedText = text;

  // 1. 금칙어 필터 (정규식으로 *** 처리)
  const filtered = filterBannedPhrases(processedText, options.domain, options.platform);
  processedText = filtered.text;
  if (filtered.warnings.length > 0) {
    warnings.push(...filtered.warnings);
  }

  // 2. mustInclude 누락 시 끝에 자연스럽게 1문장 추가
  const mustIncludeChecked = checkMustInclude(processedText, options.platform);
  processedText = mustIncludeChecked.text;
  if (mustIncludeChecked.warning) {
    warnings.push(mustIncludeChecked.warning);
  }

  // 2-1. mustInclude 보정으로 인해 생성된 "X을(를) 강조합니다." 문구 제거
  // - 예: "매력적인 제목 (H1)을(를) 강조합니다."
  // - mustInclude의 기본값(default)으로 들어간 항목일 때 발생할 수 있음
  processedText = removeMustIncludeEmphasisArtifacts(processedText);

  // 3. 해시태그: 블로그는 AI가 [[HASHTAGS]] 마커로 만든 해시태그를 우선 사용
  let hashtags: string[] = [];
  if (options.platform.id === 'blog') {
    const extracted = extractBlogHashtagsFromText(processedText);
    if (extracted.tags.length > 0) {
      processedText = extracted.cleanedText;
      hashtags = filterBlogHashtags(extracted.tags, options.platform).slice(0, options.platform.hashtagCount);
    }
  }

  // 3-1. 서비스업 블로그에서 상품/쇼핑몰용 섹션(재고/배송/환불/교환) 제거 검증
  if (options.platform.id === 'blog' && isServiceBlogDomain(options.domain.id)) {
    const filtered = filterServiceProductSections(processedText);
    if (filtered.removed) {
      processedText = filtered.text;
      warnings.push('서비스업 블로그에서 재고/배송/환불/교환 관련 섹션 문구가 감지되어 제거했습니다.');
    }

    const normalized = normalizeServiceBlogCTA(processedText);
    if (normalized.changed) {
      processedText = normalized.text;
      warnings.push('서비스업 블로그에서 쇼핑몰형 CTA 문구가 감지되어 상담 유도 문구로 교체했습니다.');
    }
  }

  // 마커가 없거나(또는 파싱 실패) 빈 경우: 기존 seed 기반 해시태그 생성으로 폴백
  if (hashtags.length === 0) {
    // 3-1. 해시태그 규칙: hashtagSeeds + 지역/메뉴/의도 키워드로 최대 platform.hashtagCount개
    hashtags = await generateHashtags(options.domain, options.platform, {
      region: options.region,
      keywords: options.keywords,
      menuNames: options.menuNames,
      intent: options.intent,
    });
  }

  // 4. 길이 제한 확인 및 조정
  // 4-0. 블로그는 목표 글자 수를 900~1,500자로 제한 (프롬프트를 따르지 않은 경우 방어적 트림)
  if (options.platform.id === 'blog') {
    const maxTarget = 1500;
    const trimmed = processedText.trim();
    if (trimmed.length > maxTarget + 100) {
      // 마지막 1500자 부근에서 문장/단락 경계로 최대한 자연스럽게 자르기
      const hard = trimmed.slice(0, maxTarget);
      const tailWindow = hard.slice(Math.max(0, hard.length - 120));
      const cutIdxInTail = Math.max(
        tailWindow.lastIndexOf('.'),
        tailWindow.lastIndexOf('!'),
        tailWindow.lastIndexOf('?'),
        tailWindow.lastIndexOf('。'),
        tailWindow.lastIndexOf('\n')
      );
      const cutAt = cutIdxInTail > 20 ? hard.length - (tailWindow.length - cutIdxInTail) + 1 : hard.length;
      processedText = hard.slice(0, cutAt).trimEnd();
      warnings.push('블로그 글자 수가 1,500자를 초과하여 1,500자 내로 자동 축약했습니다.');
    }
  }

  if (processedText.length > options.platform.maxChars) {
    processedText = truncateText(processedText, options.platform.maxChars);
    warnings.push(`Content truncated to ${options.platform.maxChars} characters`);
  }

  // 5. 플랫폼별 포맷팅 적용
  processedText = applyPlatformFormatting(processedText, options.platform);

  return {
    output: processedText.trim(),
    hashtags,
    warnings,
  };
}

/**
 * 블로그 생성 결과가 문장 종료 구두점으로 끝나는지 간단 검증
 * - 잘림(truncation) 가능성을 탐지하는 휴리스틱
 */
export function checkFinalSentencePunctuation(text: string): { ok: boolean; lastChar: string } {
  const trimmed = String(text ?? '').trim();
  const lastChar = trimmed.length > 0 ? trimmed.slice(-1) : '';
  const ok = ['.', '?', '!'].includes(lastChar);
  return { ok, lastChar };
}

/**
 * 금칙어 필터링
 * @param text - 원본 텍스트
 * @param domain - 도메인 프로필
 * @param platform - 플랫폼 템플릿
 * @returns 필터링된 텍스트 및 경고
 */
function filterBannedPhrases(
  text: string,
  domain: DomainProfile,
  platform: PlatformTemplate
): { text: string; warnings: string[] } {
  const warnings: string[] = [];
  let filteredText = text;

  // 도메인 금칙어
  const domainBanned = domain.bannedPhrases || [];
  // 플랫폼 금칙어
  const platformBanned = platform.bannedWords || [];

  // 모든 금칙어 통합
  const allBanned = [...new Set([...domainBanned, ...platformBanned])];

  if (allBanned.length === 0) {
    return { text: filteredText, warnings: [] };
  }

  // 정규식으로 금칙어 찾기 (단어 경계 고려)
  const bannedPatterns = allBanned.map((phrase) => {
    // 특수문자 이스케이프
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'gi');
  });

  const foundBanned: string[] = [];

  bannedPatterns.forEach((pattern, index) => {
    if (pattern.test(filteredText)) {
      const bannedPhrase = allBanned[index];
      foundBanned.push(bannedPhrase);
      // 금칙어를 ***로 대체
      filteredText = filteredText.replace(pattern, (match) => '*'.repeat(match.length));
    }
  });

  if (foundBanned.length > 0) {
    warnings.push(`Banned phrases replaced: ${foundBanned.join(', ')}`);
  }

  return { text: filteredText, warnings };
}

/**
 * mustInclude 체크
 * @param text - 원본 텍스트
 * @param platform - 플랫폼 템플릿
 * @returns 체크된 텍스트 및 경고
 */
function checkMustInclude(
  text: string,
  platform: PlatformTemplate
): { text: string; warning?: string } {
  const mustInclude = platform.mustInclude || [];

  if (mustInclude.length === 0) {
    return { text };
  }

  // mustInclude 항목들이 텍스트에 포함되어 있는지 확인
  const missing: string[] = [];

  mustInclude.forEach((item) => {
    // 간단한 키워드 매칭 (대소문자 무시)
    const lowerText = text.toLowerCase();
    const lowerItem = item.toLowerCase();

    // 키워드가 포함되어 있는지 확인 (부분 일치)
    if (!lowerText.includes(lowerItem)) {
      missing.push(item);
    }
  });

  if (missing.length > 0) {
    // 누락된 항목 중 첫 번째 것을 자연스럽게 끝에 추가
    const firstMissing = missing[0];
    const addition = generateMustIncludeAddition(firstMissing, platform);

    return {
      text: `${text}\n\n${addition}`,
      warning: `Added missing must-include element: ${firstMissing}`,
    };
  }

  return { text };
}

/**
 * mustInclude 추가 문장 생성
 * @param item - 누락된 항목
 * @param platform - 플랫폼 템플릿
 * @returns 추가할 문장
 */
function generateMustIncludeAddition(item: string, platform: PlatformTemplate): string {
  // 플랫폼별로 적절한 추가 문장 생성
  const additions: Record<string, string> = {
    '강렬한 첫 문장': '이 특별한 경험을 놓치지 마세요!',
    '시각적 묘사': '눈에 띄는 디테일과 아름다운 구성이 인상적입니다.',
    '감성적인 톤': '마음에 와닿는 특별한 순간을 만나보세요.',
    '이모지 활용': '✨ 특별한 경험을 기대해주세요!',
    '해시태그': '더 많은 이야기를 해시태그에서 만나보세요.',
    '임팩트 있는 시작': '지금 바로 특별한 경험을 시작하세요!',
    '대화형 톤': '여러분은 어떤 생각을 하시나요?',
    '간결한 메시지': '간단하고 명확한 메시지로 전달합니다.',
    '참여 유도': '함께 소통하고 경험을 공유해보세요.',
    '전문적인 톤': '전문적인 서비스로 고객 만족을 최우선으로 합니다.',
    '명확한 메시지': '명확하고 신뢰할 수 있는 정보를 제공합니다.',
    '비즈니스 정보': '자세한 정보는 문의해주세요.',
    '연락처 정보': '궁금한 사항이 있으시면 언제든 연락주세요.',
  };

  return additions[item] || `${item}을(를) 강조합니다.`;
}

/**
 * mustInclude 보정의 기본(default) 문구 제거
 * - mustInclude 항목이 additions 매칭에 없으면 `${item}을(를) 강조합니다.` 형태가 들어갈 수 있음
 * - 해당 문구는 최종 결과에 그대로 노출되지 않도록 제거
 */
function removeMustIncludeEmphasisArtifacts(text: string): string {
  // 줄 단위로 "무언가을(를) 강조합니다." 패턴 제거
  // - H1/H2/H3 등 괄호가 포함되어도 그대로 매칭됨
  let cleaned = text.replace(/^[^\n]*\s*을\(를\)\s*강조합니다\.?\s*$/gm, '');

  // 연속 공백/개행 정리
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned;
}

/**
 * 해시태그 생성
 * @param domain - 도메인 프로필
 * @param platform - 플랫폼 템플릿
 * @param options - 옵션 (지역, 키워드, 메뉴명 등)
 * @returns 해시태그 배열
 */
async function generateHashtags(
  domain: DomainProfile,
  platform: PlatformTemplate,
  options: { region?: string; keywords?: string[]; menuNames?: string[]; intent?: string[] } = {}
): Promise<string[]> {
  // 해시태그가 허용되지 않는 플랫폼
  if (platform.hashtagCount === 0) {
    return [];
  }

  // hashtag 플러그인의 generateHashtags 함수 사용
  try {
    // 동적 import 사용 (ESM 호환)
    const hashtagModule = await import('@/plugins/hashtag');
    const { generateHashtags: generateHashtagsFromPlugin } = hashtagModule;
    
    const hashtags = generateHashtagsFromPlugin(
      {
        region: options.region,
        keywords: options.keywords,
        menuNames: options.menuNames,
        productNames: options.menuNames, // 메뉴명을 productNames로도 전달
        intent: options.intent,
      },
      domain.hashtagSeeds || []
    );

    // 플랫폼별 블랙리스트 필터 + 최대 개수 제한
    const filtered = filterBlogHashtags(hashtags, platform);
    return filtered.slice(0, platform.hashtagCount);
  } catch (error) {
    // 플러그인을 사용할 수 없는 경우 기본 로직 사용
    console.warn('Hashtag plugin not available, using fallback logic:', error);
    const fallback = generateHashtagsFallback(domain, platform, options);
    const filtered = filterBlogHashtags(fallback, platform);
    return filtered.slice(0, platform.hashtagCount);
  }
}

/**
 * 해시태그 생성 (Fallback)
 * 플러그인을 사용할 수 없는 경우의 기본 로직
 */
function generateHashtagsFallback(
  domain: DomainProfile,
  platform: PlatformTemplate,
  options: { region?: string; keywords?: string[] } = {}
): string[] {
  const hashtags: string[] = [];

  // 1. 도메인 해시태그 시드에서 선택
  const seeds = domain.hashtagSeeds || [];
  const selectedSeeds = shuffleArray([...seeds]).slice(0, Math.floor(platform.hashtagCount * 0.6));

  hashtags.push(...selectedSeeds);

  // 2. 지역 키워드 추가
  if (options.region) {
    const regionTag = options.region.replace(/\s+/g, '').toLowerCase();
    if (!hashtags.includes(regionTag)) {
      hashtags.push(regionTag);
    }
  }

  // 3. 사용자 키워드 추가
  if (options.keywords && options.keywords.length > 0) {
    const keywordTags = options.keywords
      .map((kw) => kw.replace(/\s+/g, '').toLowerCase())
      .filter((tag) => !hashtags.includes(tag))
      .slice(0, Math.floor(platform.hashtagCount * 0.3));

    hashtags.push(...keywordTags);
  }

  // 4. 중복 제거
  const uniqueHashtags = Array.from(new Set(hashtags));

  // 5. 최대 개수 제한
  return uniqueHashtags.slice(0, platform.hashtagCount);
}

/**
 * 배열 셔플 (Fisher-Yates 알고리즘)
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 텍스트 자르기
 * @param text - 원본 텍스트
 * @param maxLength - 최대 길이
 * @returns 잘린 텍스트
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  // 단어 단위로 자르기
  const words = text.split(/\s+/);
  let truncated = '';
  let length = 0;

  for (const word of words) {
    const wordLength = word.length + 1; // 공백 포함
    if (length + wordLength > maxLength - 3) {
      // "..." 공간 확보
      break;
    }
    truncated += (truncated ? ' ' : '') + word;
    length += wordLength;
  }

  return truncated + '...';
}

/**
 * 플랫폼별 포맷팅 적용
 * @param text - 원본 텍스트
 * @param platform - 플랫폼 템플릿
 * @returns 포맷팅된 텍스트
 */
function applyPlatformFormatting(text: string, platform: PlatformTemplate): string {
  let formatted = text;

  // 라인 브레이크 스타일에 따라 처리
  if (platform.lineBreakStyle === 'short') {
    // 짧은 라인 브레이크 (2개 이상 연속 제거)
    formatted = formatted.replace(/\n{3,}/g, '\n\n');
  } else {
    // 일반 라인 브레이크 (단일 개행을 더블로)
    formatted = formatted.replace(/\n(?!\n)/g, '\n\n');
  }

  // 플랫폼별 특수 처리
  switch (platform.id) {
    case 'instagram':
      // 인스타그램: 과도한 공백 정리
      formatted = formatted.replace(/[ \t]+/g, ' ');
      break;
    case 'threads':
      // Threads: 간결한 포맷
      formatted = formatted.replace(/\n{2,}/g, '\n');
      break;
    case 'blog':
      // 블로그: 마크다운 기호 및 불필요한 텍스트 제거 (복사-붙여넣기 편의성)
      // 1. 마크다운 코드 블록 제거 (```text, ``` 등)
      formatted = formatted.replace(/```[\w]*\n?/g, '');
      formatted = formatted.replace(/```/g, '');
      // 2. 마크다운 헤더 (#) 제거
      formatted = formatted.replace(/^#{1,6}\s+/gm, '');
      // 3. 마크다운 볼드 (**텍스트** 또는 __텍스트__) 제거
      formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '$1');
      formatted = formatted.replace(/__([^_]+)__/g, '$1');
      // 4. 마크다운 리스트 기호 (*, -, +) 제거
      formatted = formatted.replace(/^[\*\-\+]\s+/gm, '');
      // 5. 마크다운 번호 리스트 (1., 2., 등) 제거
      formatted = formatted.replace(/^\d+\.\s+/gm, '');
      // 6. 마크다운 링크 [텍스트](URL) -> 텍스트만 남기기
      formatted = formatted.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');
      // 7. 영어 설명 텍스트 제거 (AI가 생성 과정을 설명하는 부분)
      formatted = formatted.replace(/I have generated.*?requirements[^\n]*/gi, '');
      formatted = formatted.replace(/Here is.*?copy[^\n]*/gi, '');
      formatted = formatted.replace(/Title:.*?\n/gi, '');
      formatted = formatted.replace(/Body:.*?\n/gi, '');
      formatted = formatted.replace(/Call-to-Action:.*?\n/gi, '');
      formatted = formatted.replace(/following all the guidelines[^\n]*/gi, '');
      formatted = formatted.replace(/Okay, I'm ready[^\n]*/gi, '');
      formatted = formatted.replace(/I have generated a blog post[^\n]*/gi, '');
      formatted = formatted.replace(/including length, tone, structure[^\n]*/gi, '');
      formatted = formatted.replace(/The post is SEO-friendly[^\n]*/gi, '');
      formatted = formatted.replace(/aims to increase engagement[^\n]*/gi, '');
      // 8. 단락 구분 명확히
      formatted = formatted.replace(/\n\n\n+/g, '\n\n');
      break;
    case 'gmb':
      // GMB: 전문적인 포맷
      formatted = formatted.replace(/\n{3,}/g, '\n\n');
      break;
  }

  return formatted.trim();
}
