/**
 * Skill Plugin 타입 정의
 */

export interface PluginContext {
  domainId: string;
  platformId: string;
  memo?: string;
  brand?: {
    name: string;
    tone: string;
    keywords: string[];
  };
}

export interface Plugin<T = any> {
  id: string;
  /**
   * 프롬프트에 삽입할 가이드 텍스트 생성
   * @param config - 플러그인 설정 (선택사항)
   * @returns 프롬프트에 포함할 가이드 텍스트
   */
  renderGuide(config?: T): string;
  /**
   * 생성된 텍스트 후처리
   * @param text - 생성된 텍스트
   * @param ctx - 컨텍스트 (도메인 ID, 플랫폼 ID)
   * @returns 후처리된 텍스트
   */
  postProcess?(
    text: string,
    ctx: { domainId: string; platformId: string }
  ): Promise<string> | string;
}
