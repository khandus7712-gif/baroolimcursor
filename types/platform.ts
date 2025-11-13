/**
 * 채널별 플랫폼 템플릿 타입 정의
 */

export type PlatformTemplate = {
  id: 'instagram' | 'blog' | 'threads' | 'gmb';
  maxChars: number;
  lineBreakStyle: 'short' | 'normal';
  hashtagCount: number;
  emojiAllowed: boolean;
  styleHints: string[];
  bannedWords?: string[];
  mustInclude?: string[];
  outputFormatHint: string; // 예: "hook → body → CTA → hashtags"
};
