/**
 * Ad Copy Plugin
 * 프로모션 카피 가이드 (혜택/기간/행동유도 문구)
 */

import type { Plugin } from '@/types/plugin';

export interface AdCopyConfig {
  promotionType?: 'sale' | 'event' | 'new_product' | 'seasonal';
  discount?: string;
  duration?: string;
  benefits?: string[];
  urgency?: boolean;
}

export const adCopyPlugin: Plugin<AdCopyConfig> = {
  id: 'adCopy',
  renderGuide(config?: AdCopyConfig): string {
    const guide: string[] = [];

    guide.push('Generate compelling advertisement copy that:');
    guide.push('1. Creates attention-grabbing headline');
    guide.push('2. Highlights key benefits and promotions');
    guide.push('3. Uses persuasive language without being pushy');
    guide.push('4. Includes clear call-to-action');
    guide.push('5. Creates urgency or scarcity when appropriate');
    guide.push('6. Maintains brand voice and tone');

    if (config?.promotionType) {
      switch (config.promotionType) {
        case 'sale':
          guide.push('\nPromotion Type: Sale');
          if (config.discount) {
            guide.push(`Discount: ${config.discount}`);
          }
          guide.push('- Emphasize savings and value');
          guide.push('- Create urgency with limited time offer');
          break;
        case 'event':
          guide.push('\nPromotion Type: Event');
          guide.push('- Highlight event details and benefits');
          guide.push('- Create excitement and anticipation');
          break;
        case 'new_product':
          guide.push('\nPromotion Type: New Product');
          guide.push('- Emphasize novelty and unique features');
          guide.push('- Create curiosity and interest');
          break;
        case 'seasonal':
          guide.push('\nPromotion Type: Seasonal');
          guide.push('- Connect with seasonal themes and emotions');
          guide.push('- Create timely relevance');
          break;
      }
    }

    if (config?.duration) {
      guide.push(`\nPromotion Duration: ${config.duration}`);
      guide.push('- Emphasize the limited time nature');
      guide.push('- Create urgency to act now');
    }

    if (config?.benefits && config.benefits.length > 0) {
      guide.push(`\nKey Benefits to Highlight:\n${config.benefits.map((b) => `- ${b}`).join('\n')}`);
    }

    if (config?.urgency) {
      guide.push('\nCreate urgency by:');
      guide.push('- Using time-sensitive language');
      guide.push('- Emphasizing limited availability');
      guide.push('- Highlighting immediate benefits');
    }

    guide.push('\nImportant compliance notes:');
    guide.push('- Avoid using banned phrases from domain profile');
    guide.push('- Do not make false or exaggerated claims');
    guide.push('- Clearly state terms and conditions if applicable');
    guide.push('- Maintain honesty and transparency');

    return guide.join('\n');
  },
};
