/**
 * Exporters
 * 생성된 콘텐츠를 다양한 형식으로 내보내기
 */

import type { PlatformContentResult } from '@/types/generate';

/**
 * JSON 형식으로 내보내기
 * @param results - 플랫폼별 콘텐츠 결과
 * @returns JSON 문자열
 */
export function exportToJson(results: PlatformContentResult[]): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      results,
    },
    null,
    2
  );
}

/**
 * CSV 형식으로 내보내기
 * @param results - 플랫폼별 콘텐츠 결과
 * @returns CSV 문자열
 */
export function exportToCsv(results: PlatformContentResult[]): string {
  const headers = ['Platform', 'Content', 'Hashtags', 'CTA'];
  const rows = results.map((result) => [
    result.platformId,
    result.content.replace(/\n/g, ' ').replace(/"/g, '""'),
    result.hashtags.join(', '),
    result.cta.replace(/"/g, '""'),
  ]);

  const csvRows = [headers, ...rows].map((row) =>
    row.map((cell) => `"${cell}"`).join(',')
  );

  return csvRows.join('\n');
}

/**
 * 텍스트 형식으로 내보내기
 * @param results - 플랫폼별 콘텐츠 결과
 * @returns 텍스트 문자열
 */
export function exportToText(results: PlatformContentResult[]): string {
  return results
    .map((result) => {
      return `=== ${result.platformId.toUpperCase()} ===\n\n${result.content}\n\nHashtags: ${result.hashtags.join(', ')}\n\nCTA: ${result.cta}\n\n`;
    })
    .join('\n---\n\n');
}

/**
 * 마크다운 형식으로 내보내기
 * @param results - 플랫폼별 콘텐츠 결과
 * @returns 마크다운 문자열
 */
export function exportToMarkdown(results: PlatformContentResult[]): string {
  return results
    .map((result) => {
      return `## ${result.platformId}\n\n${result.content}\n\n**Hashtags:** ${result.hashtags.map((tag) => `#${tag}`).join(' ')}\n\n**CTA:** ${result.cta}\n\n`;
    })
    .join('---\n\n');
}

/**
 * 클립보드로 복사하기 위한 형식
 * @param result - 단일 플랫폼 콘텐츠 결과
 * @returns 클립보드용 텍스트
 */
export function exportToClipboard(result: PlatformContentResult): string {
  // 플랫폼별로 최적화된 형식으로 변환
  let clipboardText = result.content;

  // 해시태그 추가
  if (result.hashtags.length > 0) {
    clipboardText += '\n\n' + result.hashtags.map((tag) => `#${tag}`).join(' ');
  }

  // CTA 추가 (아직 없다면)
  if (result.cta && !clipboardText.includes(result.cta)) {
    clipboardText += '\n\n' + result.cta;
  }

  return clipboardText;
}

/**
 * 내보내기 형식 타입
 */
export type ExportFormat = 'json' | 'csv' | 'text' | 'markdown' | 'clipboard';

/**
 * 내보내기 함수
 * @param results - 플랫폼별 콘텐츠 결과
 * @param format - 내보내기 형식
 * @param singleResult - 단일 결과 (clipboard용)
 * @returns 내보낸 문자열
 */
export function exportContent(
  results: PlatformContentResult[],
  format: ExportFormat,
  singleResult?: PlatformContentResult
): string {
  switch (format) {
    case 'json':
      return exportToJson(results);
    case 'csv':
      return exportToCsv(results);
    case 'text':
      return exportToText(results);
    case 'markdown':
      return exportToMarkdown(results);
    case 'clipboard':
      if (!singleResult) {
        throw new Error('Single result is required for clipboard export');
      }
      return exportToClipboard(singleResult);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

/**
 * 파일 다운로드를 위한 Blob 생성
 * @param content - 콘텐츠 문자열
 * @param format - 내보내기 형식
 * @returns Blob 객체
 */
export function createDownloadBlob(content: string, format: ExportFormat): Blob {
  const mimeTypes: Record<ExportFormat, string> = {
    json: 'application/json',
    csv: 'text/csv',
    text: 'text/plain',
    markdown: 'text/markdown',
    clipboard: 'text/plain',
  };

  return new Blob([content], { type: mimeTypes[format] });
}

/**
 * 파일명 생성
 * @param format - 내보내기 형식
 * @returns 파일명
 */
export function generateFilename(format: ExportFormat): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const extensions: Record<ExportFormat, string> = {
    json: 'json',
    csv: 'csv',
    text: 'txt',
    markdown: 'md',
    clipboard: 'txt',
  };

  return `baroolim-export-${timestamp}.${extensions[format]}`;
}

