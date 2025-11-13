/**
 * 콘텐츠 생성 관련 타입 정의
 */

import type { DomainProfile } from './domain';
import type { PlatformTemplate } from './platform';
import type { PluginContext } from './plugin';

/**
 * 콘텐츠 생성 요청
 */
export interface GenerateContentRequest {
  /** 업종 ID */
  domainId: string;
  /** 플랫폼 ID 목록 */
  platformIds: string[];
  /** 사용자 입력 이미지 (base64 또는 URL) */
  image?: string;
  /** 사용자 메모 */
  memo?: string;
  /** 적용할 플러그인 ID 목록 */
  pluginIds?: string[];
  /** 브랜드 정보 */
  brand?: {
    name: string;
    tone: string;
    keywords: string[];
  };
  /** 추가 옵션 */
  options?: {
    /** 톤앤매너 오버라이드 */
    tone?: string;
    /** 금칙어 추가 */
    additionalForbiddenWords?: string[];
    /** CTA 커스터마이징 */
    customCta?: string;
  };
}

/**
 * 플랫폼별 생성 결과
 */
export interface PlatformContentResult {
  /** 플랫폼 ID */
  platformId: string;
  /** 생성된 콘텐츠 */
  content: string;
  /** 해시태그 */
  hashtags: string[];
  /** CTA */
  cta: string;
  /** 메타데이터 */
  metadata?: Record<string, unknown>;
}

/**
 * 콘텐츠 생성 응답
 */
export interface GenerateContentResponse {
  /** 요청 ID */
  requestId: string;
  /** 업종 정보 */
  domain: DomainProfile;
  /** 플랫폼별 결과 */
  results: PlatformContentResult[];
  /** 생성 시간 */
  createdAt: Date;
  /** 이미지 URL (저장된 경우) */
  imageUrl?: string;
}

/**
 * 프롬프트 컴포저 컨텍스트
 */
export interface PromptComposerContext extends PluginContext {
  /** 시스템 프롬프트 */
  systemPrompt?: string;
  /** 플랫폼별 프롬프트 */
  platformPrompt?: string;
  /** 브랜드 프롬프트 */
  brandPrompt?: string;
  /** 플러그인 프롬프트 */
  pluginPrompts?: string[];
  /** 컨텐츠 프롬프트 */
  contentPrompt?: string;
}

/**
 * 포스트 프로세서 옵션
 */
export interface PostProcessorOptions {
  /** 금칙어 필터링 활성화 */
  filterForbiddenWords: boolean;
  /** 해시태그 추가 활성화 */
  addHashtags: boolean;
  /** CTA 추가 활성화 */
  addCta: boolean;
  /** 길이 제한 적용 */
  applyLengthLimit: boolean;
  /** 플랫폼별 포맷팅 적용 */
  applyPlatformFormatting: boolean;
}

