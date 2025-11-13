/**
 * Profile Loader
 * 도메인 및 플랫폼 프로필을 로드하는 유틸리티
 */

import type { DomainProfile } from '@/types/domain';
import type { PlatformTemplate } from '@/types/platform';
import foodProfile from '@/profiles/domains/food.json';
import beautyProfile from '@/profiles/domains/beauty.json';
import retailProfile from '@/profiles/domains/retail.json';
import instagramTemplate from '@/profiles/platforms/instagram.json';
import blogTemplate from '@/profiles/platforms/blog.json';
import threadsTemplate from '@/profiles/platforms/threads.json';
import gmbTemplate from '@/profiles/platforms/gmb.json';

/**
 * 구독 플랜 타입
 */
export type SubscriptionPlan = 'FREE' | 'BASIC' | 'PRO';

/**
 * 플랜별 접근 가능한 도메인 정의
 */
export const PLAN_DOMAINS: Record<SubscriptionPlan, string[]> = {
  FREE: ['food', 'beauty', 'retail'],
  BASIC: [
    'food', 'beauty', 'retail',
    'cafe', 'fitness', 'pet',
    'education', 'realestate', 'auto', 'travel'
  ],
  PRO: [
    'food', 'beauty', 'retail',
    'cafe', 'fitness', 'pet',
    'education', 'realestate', 'auto', 'travel',
    'medical', 'legal', 'interior',
    'flower', 'laundry', 'photo', 'print',
    'repair', 'rental', 'hotel', 'spa'
  ]
};

/**
 * 도메인별 필요 플랜 조회
 */
export function getDomainRequiredPlan(domainId: string): SubscriptionPlan {
  if (PLAN_DOMAINS.FREE.includes(domainId)) return 'FREE';
  if (PLAN_DOMAINS.BASIC.includes(domainId)) return 'BASIC';
  if (PLAN_DOMAINS.PRO.includes(domainId)) return 'PRO';
  return 'PRO'; // 기본값
}

/**
 * 도메인 프로필 레지스트리
 */
const domainProfiles: Record<string, DomainProfile> = {
  food: foodProfile as DomainProfile,
  beauty: beautyProfile as DomainProfile,
  retail: retailProfile as DomainProfile,
};

/**
 * 플랫폼 템플릿 레지스트리
 */
const platformTemplates: Record<string, PlatformTemplate> = {
  instagram: instagramTemplate as PlatformTemplate,
  blog: blogTemplate as PlatformTemplate,
  threads: threadsTemplate as PlatformTemplate,
  gmb: gmbTemplate as PlatformTemplate,
};

/**
 * 도메인 프로필 로드
 * @param domainId - 도메인 ID
 * @returns 도메인 프로필
 * @throws 도메인 프로필을 찾을 수 없는 경우 에러
 */
export function loadDomainProfile(domainId: string): DomainProfile {
  const profile = domainProfiles[domainId];
  if (!profile) {
    throw new Error(`Domain profile not found: ${domainId}`);
  }
  return profile;
}

/**
 * 플랫폼 템플릿 로드
 * @param platformId - 플랫폼 ID
 * @returns 플랫폼 템플릿
 * @throws 플랫폼 템플릿을 찾을 수 없는 경우 에러
 */
export function loadPlatformTemplate(platformId: string): PlatformTemplate {
  const template = platformTemplates[platformId];
  if (!template) {
    throw new Error(`Platform template not found: ${platformId}`);
  }
  return template;
}

/**
 * 사용 가능한 도메인 목록 조회
 * @param userPlan - 사용자 플랜 (선택사항, 기본값: FREE)
 * @returns 도메인 ID 목록
 */
export function getAvailableDomains(userPlan: SubscriptionPlan = 'FREE'): string[] {
  return PLAN_DOMAINS[userPlan] || PLAN_DOMAINS.FREE;
}

/**
 * 도메인 접근 권한 체크
 * @param domainId - 도메인 ID
 * @param userPlan - 사용자 플랜
 * @returns 접근 가능 여부
 */
export function canAccessDomain(domainId: string, userPlan: SubscriptionPlan = 'FREE'): boolean {
  const availableDomains = getAvailableDomains(userPlan);
  return availableDomains.includes(domainId);
}

/**
 * 사용 가능한 플랫폼 목록 조회
 * @returns 플랫폼 ID 목록
 */
export function getAvailablePlatforms(): string[] {
  return Object.keys(platformTemplates);
}

/**
 * 여러 플랫폼 템플릿 로드
 * @param platformIds - 플랫폼 ID 목록
 * @returns 플랫폼 템플릿 목록
 */
export function loadPlatformTemplates(platformIds: string[]): PlatformTemplate[] {
  return platformIds.map((id) => loadPlatformTemplate(id));
}

