/**
 * 웹 검색 유틸리티
 * 관련 블로그 포스트 및 콘텐츠를 검색하여 프롬프트에 포함
 */

export interface SearchResult {
  title: string;
  url: string;
  content: string;
  snippet?: string;
}

export interface WebSearchOptions {
  query: string;
  maxResults?: number;
  domain?: string; // 업종 (food, beauty, retail 등)
}

/**
 * Tavily API를 사용한 웹 검색
 * @param options - 검색 옵션
 * @returns 검색 결과 배열
 */
export async function searchWeb(options: WebSearchOptions): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  
  if (!apiKey) {
    console.warn('TAVILY_API_KEY is not set. Web search will be skipped.');
    return [];
  }

  try {
    const { query, maxResults = 5, domain } = options;
    
    // 도메인별 검색 쿼리 최적화
    let searchQuery = query;
    if (domain) {
      // 한국어 업종 키워드 추가
      const domainKeywords: Record<string, string> = {
        food: '음식 식당 맛집',
        beauty: '뷰티 미용',
        retail: '소매 유통 쇼핑',
      };
      
      if (domainKeywords[domain]) {
        searchQuery = `${query} ${domainKeywords[domain]}`;
      }
    }

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: searchQuery,
        search_depth: 'basic',
        include_answer: false,
        include_images: false,
        include_raw_content: true,
        max_results: maxResults,
        include_domains: [], // 특정 도메인 제한 없음
        exclude_domains: [], // 제외할 도메인 없음
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tavily API error:', errorText);
      return [];
    }

    const data = await response.json();
    
    // Tavily API 응답 형식에 맞게 변환
    const results: SearchResult[] = (data.results || []).map((result: any) => ({
      title: result.title || '',
      url: result.url || '',
      content: result.content || result.raw_content || '',
      snippet: result.content?.substring(0, 200) || '',
    }));

    return results;
  } catch (error) {
    console.error('Error searching web:', error);
    return [];
  }
}

/**
 * 검색 결과를 프롬프트에 포함할 형식으로 포맷팅
 * @param results - 검색 결과 배열
 * @returns 포맷팅된 문자열
 */
export function formatSearchResultsForPrompt(results: SearchResult[]): string {
  if (results.length === 0) {
    return '';
  }

  const sections = [
    '[RESEARCH_CONTEXT]',
    '',
    'The following are relevant blog posts and articles found online that may provide inspiration and context:',
    '',
  ];

  results.forEach((result, index) => {
    sections.push(`${index + 1}. Title: ${result.title}`);
    sections.push(`   URL: ${result.url}`);
    sections.push(`   Content Summary: ${result.snippet || result.content.substring(0, 300)}...`);
    sections.push('');
  });

  sections.push(
    'Instructions:',
    '- Use these sources as inspiration and reference, but create ORIGINAL content',
    '- Do NOT copy text directly from these sources',
    '- Synthesize information and create unique content that reflects your brand voice',
    '- If relevant, incorporate insights and trends from these sources naturally',
    '- Ensure the final content is original and not plagiarized',
  );

  return sections.join('\n');
}

/**
 * 검색이 필요한지 판단
 * @param notes - 사용자 메모
 * @param keywords - 키워드
 * @returns 검색이 필요한지 여부
 */
export function shouldSearchWeb(notes?: string, keywords?: string[]): boolean {
  if (!notes && (!keywords || keywords.length === 0)) {
    return false;
  }
  
  // 최소한의 정보가 있어야 검색 가능
  const hasContent = (notes && notes.length > 10) || (keywords && keywords.length > 0);
  return hasContent;
}

/**
 * 검색 쿼리 생성
 * @param notes - 사용자 메모
 * @param keywords - 키워드 배열
 * @param domain - 업종
 * @returns 검색 쿼리 문자열
 */
export function buildSearchQuery(
  notes?: string,
  keywords?: string[],
  domain?: string,
  brandName?: string,
  region?: string
): string {
  const parts: string[] = [];
  if (brandName) {
    parts.push(brandName);
  }
  if (region) {
    parts.push(region);
  }
  
  if (keywords && keywords.length > 0) {
    parts.push(...keywords);
  }
  
  if (notes) {
    // 메모에서 핵심 키워드 추출 (간단한 방식)
    const noteWords = notes
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 5); // 최대 5개 단어만 사용
    parts.push(...noteWords);
  }
  
  if (parts.length === 0 && domain) {
    parts.push(domain);
  }

  return parts.join(' ');
}

