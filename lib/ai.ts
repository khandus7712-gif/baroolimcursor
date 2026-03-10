/**
 * Anthropic Claude 클라이언트
 * 콘텐츠 생성 및 이미지 분석
 */

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * 텍스트 콘텐츠 생성
 * @param prompt - 프롬프트
 * @param imageBase64 - 이미지 (Base64, 선택사항)
 * @returns 생성된 콘텐츠
 */
export async function generateContent(
  prompt: string,
  imageBase64?: string
): Promise<string> {
  try {
    if (imageBase64) {
      const mimeMatch = imageBase64.match(/^data:image\/(\w+);base64,/);
      let mimeType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' = 'image/jpeg';

      if (mimeMatch) {
        const imageType = mimeMatch[1].toLowerCase();
        if (imageType === 'png') mimeType = 'image/png';
        else if (imageType === 'gif') mimeType = 'image/gif';
        else if (imageType === 'webp') mimeType = 'image/webp';
      }

      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              },
            },
            { type: 'text', text: prompt },
          ],
        }],
      });

      return response.content[0].type === 'text' ? response.content[0].text : '';
    } else {
      const response = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2048,
        messages: [{ role: 'user', content: prompt }],
      });

      return response.content[0].type === 'text' ? response.content[0].text : '';
    }
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error(`Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * 이미지 분석
 * @param imageBase64 - 이미지 (Base64)
 * @param analysisPrompt - 분석 프롬프트
 * @returns 분석 결과
 */
export async function analyzeImage(
  imageBase64: string,
  analysisPrompt: string
): Promise<string> {
  return generateContent(analysisPrompt, imageBase64);
}