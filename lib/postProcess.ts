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

  // 3. 해시태그 규칙: hashtagSeeds + 지역/메뉴/의도 키워드로 최대 platform.hashtagCount개
  const hashtags = await generateHashtags(options.domain, options.platform, {
    region: options.region,
    keywords: options.keywords,
    menuNames: options.menuNames,
    intent: options.intent,
  });

  // 4. 길이 제한 확인 및 조정
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

    // 플랫폼별 최대 개수 제한
    return hashtags.slice(0, platform.hashtagCount);
  } catch (error) {
    // 플러그인을 사용할 수 없는 경우 기본 로직 사용
    console.warn('Hashtag plugin not available, using fallback logic:', error);
    return generateHashtagsFallback(domain, platform, options);
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
      // 블로그: 단락 구분 명확히
      formatted = formatted.replace(/\n\n\n+/g, '\n\n');
      break;
    case 'gmb':
      // GMB: 전문적인 포맷
      formatted = formatted.replace(/\n{3,}/g, '\n\n');
      break;
  }

  return formatted.trim();
}
