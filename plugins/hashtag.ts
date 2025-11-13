/**
 * Hashtag Plugin
 * 키워드→해시태그 후보 생성 (지역/메뉴/의도 키워드 합성, 중복/동의어 제거)
 */

import type { Plugin } from '@/types/plugin';

export interface HashtagConfig {
  region?: string;
  keywords?: string[];
  productNames?: string[];
  menuNames?: string[];
  intent?: string[];
}

/**
 * 동의어 사전 (한국어)
 */
const synonyms: Record<string, string[]> = {
  맛집: ['맛스타그램', '맛있는집', '맛집추천'],
  음식: ['요리', '식사', '먹방'],
  식당: ['레스토랑', '음식점', '맛집'],
  카페: ['커피숍', '카페테리아'],
  맛있는: ['맛난', '맛좋은', '유명한'],
  신선한: ['싱싱한', '신선함'],
  특별한: ['특별함', '독특한'],
};

/**
 * 해시태그 생성 및 정제
 * 지역/메뉴/의도 키워드를 합성하고 중복/동의어 제거
 * @param config - 해시태그 설정
 * @param domainHashtagSeeds - 도메인별 해시태그 시드
 * @returns 정제된 해시태그 배열
 */
export function generateHashtags(config: HashtagConfig, domainHashtagSeeds: string[] = []): string[] {
  const hashtags: string[] = [];

  // 1. 지역 키워드 추가
  if (config.region) {
    const regionTags = normalizeRegion(config.region);
    hashtags.push(...regionTags);
  }

  // 2. 메뉴/상품명 키워드 추가
  if (config.menuNames && config.menuNames.length > 0) {
    const menuTags = config.menuNames.map((menu) => normalizeKeyword(menu));
    hashtags.push(...menuTags);
  }

  if (config.productNames && config.productNames.length > 0) {
    const productTags = config.productNames.map((product) => normalizeKeyword(product));
    hashtags.push(...productTags);
  }

  // 3. 일반 키워드 추가
  if (config.keywords && config.keywords.length > 0) {
    const keywordTags = config.keywords.map((keyword) => normalizeKeyword(keyword));
    hashtags.push(...keywordTags);
  }

  // 4. 의도 키워드 추가
  if (config.intent && config.intent.length > 0) {
    const intentTags = config.intent.map((intent) => normalizeKeyword(intent));
    hashtags.push(...intentTags);
  }

  // 5. 도메인 해시태그 시드 추가
  hashtags.push(...domainHashtagSeeds.map((seed) => normalizeKeyword(seed)));

  // 6. 중복 제거
  const uniqueHashtags = removeDuplicates(hashtags);

  // 7. 동의어 제거 (같은 의미의 해시태그 중 하나만 유지)
  const deduplicatedHashtags = removeSynonyms(uniqueHashtags);

  return deduplicatedHashtags;
}

/**
 * 지역명 정규화
 */
function normalizeRegion(region: string): string[] {
  const tags: string[] = [];
  
  // 공백 제거 및 소문자 변환
  const normalized = region.replace(/\s+/g, '').toLowerCase();
  
  // 기본 지역 태그
  tags.push(normalized);
  
  // 지역 + 맛집 조합
  if (normalized.includes('서울') || normalized.includes('강남') || normalized.includes('홍대')) {
    tags.push(`${normalized}맛집`);
    tags.push(`${normalized}식당`);
  }
  
  // 지역 + 음식 조합 (예: 강남한식, 홍대카페)
  // 이는 키워드와 조합되어 생성될 수 있으므로 여기서는 기본 지역만 반환
  
  return tags.filter((tag) => tag.length > 0);
}

/**
 * 키워드 정규화
 */
function normalizeKeyword(keyword: string): string {
  // 공백 제거
  let normalized = keyword.replace(/\s+/g, '');
  
  // 특수문자 제거 (해시태그에 사용 가능한 문자만 유지)
  normalized = normalized.replace(/[^가-힣a-zA-Z0-9_]/g, '');
  
  // 소문자 변환 (영문인 경우)
  normalized = normalized.toLowerCase();
  
  return normalized;
}

/**
 * 중복 제거
 */
function removeDuplicates(hashtags: string[]): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];
  
  for (const tag of hashtags) {
    const normalized = tag.toLowerCase().trim();
    if (normalized && !seen.has(normalized)) {
      seen.add(normalized);
      unique.push(normalized);
    }
  }
  
  return unique;
}

/**
 * 동의어 제거 (같은 의미의 해시태그 중 하나만 유지)
 */
function removeSynonyms(hashtags: string[]): string[] {
  const result: string[] = [];
  const usedGroups = new Set<string>();
  
  for (const tag of hashtags) {
    // 동의어 그룹 찾기
    let groupKey: string | null = null;
    
    for (const [key, synonymsList] of Object.entries(synonyms)) {
      if (tag === key || synonymsList.includes(tag)) {
        groupKey = key;
        break;
      }
    }
    
    if (groupKey) {
      // 동의어 그룹이 이미 사용되었는지 확인
      if (!usedGroups.has(groupKey)) {
        usedGroups.add(groupKey);
        result.push(tag); // 첫 번째로 나타난 동의어 사용
      }
      // 이미 사용된 그룹이면 건너뜀
    } else {
      // 동의어 그룹에 속하지 않으면 그대로 추가
      result.push(tag);
    }
  }
  
  return result;
}

export const hashtagPlugin: Plugin<HashtagConfig> = {
  id: 'hashtag',
  renderGuide(config?: HashtagConfig): string {
    const guide: string[] = [];

    guide.push('Generate relevant hashtags that:');
    guide.push('1. Mix popular and niche hashtags');
    guide.push('2. Include industry-specific tags');
    guide.push('3. Add location-based tags when relevant');
    guide.push('4. Use brand-specific hashtags');
    guide.push('5. Include trending hashtags when appropriate');
    guide.push('6. Stay within platform hashtag limits');
    guide.push('7. Remove duplicates and synonyms automatically');

    if (config?.region) {
      guide.push(`\nRegion/Location: ${config.region}`);
      guide.push('- Include location-based hashtags');
      guide.push('- Use region-specific keywords');
      guide.push('- Consider local trends and culture');
      guide.push(`- Generate tags like: ${config.region}, ${config.region}맛집, ${config.region}식당`);
    }

    if (config?.menuNames && config.menuNames.length > 0) {
      guide.push(`\nMenu Names: ${config.menuNames.join(', ')}`);
      guide.push('- Create menu-specific hashtags');
      guide.push('- Use menu category hashtags');
      guide.push('- Include menu feature hashtags');
    }

    if (config?.keywords && config.keywords.length > 0) {
      guide.push(`\nKeywords to incorporate: ${config.keywords.join(', ')}`);
      guide.push('- Create hashtags from these keywords');
      guide.push('- Combine keywords for unique hashtags');
      guide.push('- Use keyword variations');
      guide.push('- Remove duplicate and synonymous tags');
    }

    if (config?.productNames && config.productNames.length > 0) {
      guide.push(`\nProduct Names: ${config.productNames.join(', ')}`);
      guide.push('- Create product-specific hashtags');
      guide.push('- Use product category hashtags');
      guide.push('- Include product feature hashtags');
    }

    if (config?.intent && config.intent.length > 0) {
      guide.push(`\nIntent/Goals: ${config.intent.join(', ')}`);
      guide.push('- Align hashtags with marketing intent');
      guide.push('- Use goal-oriented hashtags');
      guide.push('- Include action-oriented tags');
    }

    guide.push('\nHashtag Strategy:');
    guide.push('- Use a mix of broad and specific hashtags');
    guide.push('- Include 2-3 popular hashtags (high volume)');
    guide.push('- Include 5-7 niche hashtags (targeted audience)');
    guide.push('- Include 2-3 location-based hashtags (if applicable)');
    guide.push('- Include 1-2 brand-specific hashtags');
    guide.push('- Avoid overused or spammy hashtags');
    guide.push('- Keep hashtags relevant to content');
    guide.push('- Remove duplicates and synonyms automatically');

    guide.push('\nImportant notes:');
    guide.push('- Respect platform hashtag limits');
    guide.push('- Use hashtags naturally and relevantly');
    guide.push('- Avoid hashtag stuffing');
    guide.push('- Test hashtag performance over time');
    guide.push('- Duplicate and synonymous hashtags will be automatically removed');

    return guide.join('\n');
  },

  postProcess(text: string, ctx: { domainId: string; platformId: string }): string {
    // 해시태그 플러그인은 후처리에서 해시태그를 추출하거나 생성하는 로직은
    // postProcess.ts의 generateHashtags 함수에서 처리되므로
    // 여기서는 텍스트 자체를 수정하지 않음
    return text;
  },
};

/**
 * 플러그인 레지스트리
 */
export const pluginRegistry = [
  require('./reviewReply').reviewReplyPlugin,
  require('./adCopy').adCopyPlugin,
  require('./bookingCta').bookingCtaPlugin,
  require('./hashtag').hashtagPlugin,
];

/**
 * 플러그인 ID로 플러그인 찾기
 */
export function getPlugin(pluginId: string): Plugin | undefined {
  return pluginRegistry.find((plugin) => plugin.id === pluginId);
}

/**
 * 여러 플러그인 가져오기
 */
export function getPlugins(pluginIds: string[]): Plugin[] {
  return pluginIds.map((id) => getPlugin(id)).filter((p): p is Plugin => p !== undefined);
}
