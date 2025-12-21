/**
 * Google AI (Gemini) 클라이언트 + OpenAI Fallback
 * 콘텐츠 생성 및 이미지 분석
 * Gemini API 실패 시 자동으로 OpenAI로 fallback
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Gemini 클라이언트
const googleApiKey = process.env.GOOGLE_API_KEY;
if (!googleApiKey) {
  throw new Error('GOOGLE_API_KEY is not set');
}
const genAI = new GoogleGenerativeAI(googleApiKey);

// OpenAI 클라이언트 (fallback용, 선택사항)
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

/**
 * 텍스트 콘텐츠 생성 (Gemini → OpenAI Fallback)
 * @param prompt - 프롬프트
 * @param imageBase64 - 이미지 (Base64, 선택사항)
 * @returns 생성된 콘텐츠
 */
export async function generateContent(
  prompt: string,
  imageBase64?: string
): Promise<string> {
  // 1. 먼저 Gemini API 시도
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

    if (imageBase64) {
      // 멀티모달 (이미지 + 텍스트)
      const mimeMatch = imageBase64.match(/^data:image\/(\w+);base64,/);
      let mimeType = 'image/jpeg';
      
      if (mimeMatch) {
        const imageType = mimeMatch[1].toLowerCase();
        if (imageType === 'jpg') {
          mimeType = 'image/jpeg';
        } else {
          mimeType = `image/${imageType}`;
        }
      }
      
      const imagePart = {
        inlineData: {
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          mimeType: mimeType,
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;
      return response.text();
    } else {
      // 텍스트만
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (geminiError) {
    // 2. Gemini 실패 시 OpenAI로 fallback
    console.warn('Gemini API failed, falling back to OpenAI:', geminiError);
    
    if (!openai) {
      throw new Error(
        `Gemini API failed and OpenAI is not configured. ` +
        `Please set OPENAI_API_KEY in your environment variables. ` +
        `Original error: ${geminiError instanceof Error ? geminiError.message : 'Unknown error'}`
      );
    }

    try {
      if (imageBase64) {
        // OpenAI Vision API 사용 (gpt-4o 또는 gpt-4o-mini)
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini', // 이미지 지원, 비용 효율적
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: { url: imageBase64 },
                },
              ],
            },
          ],
          max_tokens: 2000,
        });
        
        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('OpenAI returned empty response');
        }
        return content;
      } else {
        // 텍스트만
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
        });
        
        const content = response.choices[0]?.message?.content;
        if (!content) {
          throw new Error('OpenAI returned empty response');
        }
        return content;
      }
    } catch (openaiError) {
      // 두 API 모두 실패
      throw new Error(
        `Both Gemini and OpenAI APIs failed. ` +
        `Gemini: ${geminiError instanceof Error ? geminiError.message : 'Unknown error'}. ` +
        `OpenAI: ${openaiError instanceof Error ? openaiError.message : 'Unknown error'}`
      );
    }
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

