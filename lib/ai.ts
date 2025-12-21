/**
 * Google AI (Gemini) 클라이언트
 * 콘텐츠 생성 및 이미지 분석
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);

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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    if (imageBase64) {
      // 멀티모달 (이미지 + 텍스트)
      // Base64 이미지를 파트로 변환
      const mimeMatch = imageBase64.match(/^data:image\/(\w+);base64,/);
      let mimeType = 'image/jpeg'; // 기본값
      
      if (mimeMatch) {
        const imageType = mimeMatch[1].toLowerCase();
        // jpg를 jpeg로 정규화하고 image/ 접두사 추가
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

