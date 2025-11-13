/**
 * Review Reply Plugin
 * 리뷰 자동응답 가이드 (감사/개선/재방문 유도, 업종별 금칙 반영)
 */

import type { Plugin } from '@/types/plugin';

export interface ReviewReplyConfig {
  reviewType?: 'positive' | 'negative' | 'neutral';
  rating?: number;
  specificIssues?: string[];
}

export const reviewReplyPlugin: Plugin<ReviewReplyConfig> = {
  id: 'reviewReply',
  renderGuide(config?: ReviewReplyConfig): string {
    const guide: string[] = [];

    guide.push('Generate a professional review reply that:');
    guide.push('1. Expresses genuine gratitude for the review');
    guide.push('2. Acknowledges specific points mentioned in the review');
    guide.push('3. Shows empathy and understanding');
    guide.push('4. Addresses any concerns or issues (if negative review)');
    guide.push('5. Highlights positive aspects (if positive review)');
    guide.push('6. Invites future visits or engagement');
    guide.push('7. Maintains a professional and warm tone');

    if (config?.reviewType === 'negative') {
      guide.push('\nFor negative reviews:');
      guide.push('- Apologize sincerely without being defensive');
      guide.push('- Acknowledge the specific issue');
      guide.push('- Offer a solution or improvement plan');
      guide.push('- Invite further communication offline if needed');
    } else if (config?.reviewType === 'positive') {
      guide.push('\nFor positive reviews:');
      guide.push('- Express genuine appreciation');
      guide.push('- Highlight what made their experience special');
      guide.push('- Encourage them to visit again');
      guide.push('- Ask them to share their experience with others');
    }

    if (config?.specificIssues && config.specificIssues.length > 0) {
      guide.push(`\nAddress these specific issues: ${config.specificIssues.join(', ')}`);
    }

    guide.push('\nImportant compliance notes:');
    guide.push('- Never use banned phrases from the domain profile');
    guide.push('- Avoid making medical or health claims');
    guide.push('- Do not promise specific outcomes or guarantees');
    guide.push('- Keep the response authentic and personalized');

    return guide.join('\n');
  },

  postProcess(text: string, ctx: { domainId: string; platformId: string }): string {
    // GMB 플랫폼의 경우 더 공식적인 톤으로 조정
    if (ctx.platformId === 'gmb') {
      // 너무 캐주얼한 표현을 공식적으로 변경
      let processed = text;
      processed = processed.replace(/ㅎㅎ|ㅋㅋ/g, '');
      processed = processed.replace(/!{2,}/g, '!');
      return processed;
    }

    return text;
  },
};
