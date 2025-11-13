/**
 * 콘텐츠 생성 API
 * form-data로 이미지와 메모를 받아 AI로 콘텐츠 생성
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import sharp from 'sharp';
import { composePrompt, createImageAnalysisPrompt } from '@/lib/promptComposer';
import { runPostProcess } from '@/lib/postProcess';
import { loadDomainProfile, loadPlatformTemplate } from '@/lib/profileLoader';
import { getPlugins } from '@/plugins/hashtag';
import { generateContent, analyzeImage } from '@/lib/ai';
import { uploadImage } from '@/lib/storage';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

/**
 * form-data 파싱
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

interface GenerateRequest {
  image?: Buffer;
  imageMimeType?: string;
  notes?: string;
  keywords?: string[];
  domainId: string;
  platformId: string;
  brandName?: string;
  region?: string;
  link?: string;
  voiceHints?: string[];
  plugins?: string[];
}

/**
 * 콘텐츠 생성 핸들러
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // form-data 파싱
    const form = new IncomingForm({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    // 요청 데이터 추출
    const request: GenerateRequest = {
      domainId: Array.isArray(fields.domainId) ? fields.domainId[0] : fields.domainId || '',
      platformId: Array.isArray(fields.platformId) ? fields.platformId[0] : fields.platformId || '',
      notes: Array.isArray(fields.notes) ? fields.notes[0] : fields.notes,
      keywords: Array.isArray(fields.keywords) ? fields.keywords : fields.keywords ? [fields.keywords] : [],
      brandName: Array.isArray(fields.brandName) ? fields.brandName[0] : fields.brandName,
      region: Array.isArray(fields.region) ? fields.region[0] : fields.region,
      link: Array.isArray(fields.link) ? fields.link[0] : fields.link,
      voiceHints: Array.isArray(fields.voiceHints) ? fields.voiceHints : fields.voiceHints ? [fields.voiceHints] : [],
      plugins: Array.isArray(fields.plugins) ? fields.plugins : fields.plugins ? [fields.plugins] : [],
    };

    // 필수 필드 검증
    if (!request.domainId || !request.platformId) {
      return res.status(400).json({ error: 'Missing required fields: domainId, platformId' });
    }

    // 이미지 처리
    let imageBuffer: Buffer | undefined;
    let imageMimeType: string | undefined;
    let imageUrl: string | undefined;

    if (files.image && Array.isArray(files.image) && files.image.length > 0) {
      const imageFile = files.image[0];
      const originalBuffer = await fs.readFile(imageFile.filepath);
      
      // PNG를 JPEG로 변환 (Gemini API가 PNG를 지원하지 않음)
      try {
        imageBuffer = await sharp(originalBuffer)
          .jpeg({ quality: 90 })
          .toBuffer();
        imageMimeType = 'image/jpeg';
      } catch (error) {
        console.error('Failed to convert image:', error);
        // 변환 실패 시 원본 사용
        imageBuffer = originalBuffer;
        imageMimeType = imageFile.mimetype || 'image/jpeg';
      }

      // 이미지 업로드
      try {
        const fileName = `${uuidv4()}.jpg`;
        imageUrl = await uploadImage(imageBuffer, fileName, imageMimeType);
      } catch (error) {
        console.error('Failed to upload image:', error);
        // 이미지 업로드 실패해도 계속 진행
      }
    }

    // 1) 도메인/플랫폼 JSON 로드
    const domain = loadDomainProfile(request.domainId);
    const platform = loadPlatformTemplate(request.platformId);

    // 2) 선택 플러그인 renderGuide 합치기
    const plugins = request.plugins && request.plugins.length > 0 ? getPlugins(request.plugins) : [];

    // 3) 이미지 분석 (이미지가 있는 경우)
    let imageCaption: string | undefined;
    if (imageBuffer) {
      try {
        const imageBase64 = imageBuffer.toString('base64');
        const analysisPrompt = createImageAnalysisPrompt(domain, request.notes);
        imageCaption = await analyzeImage(`data:${imageMimeType};base64,${imageBase64}`, analysisPrompt);
      } catch (error) {
        console.error('Failed to analyze image:', error);
        // 이미지 분석 실패해도 계속 진행
      }
    }

    // 4) 프롬프트 컴포저로 프롬프트 생성
    const prompt = composePrompt({
      domain,
      platform,
      brand: request.brandName
        ? {
            name: request.brandName,
            tone: request.voiceHints?.[0],
            keywords: request.keywords,
            voiceHints: request.voiceHints,
          }
        : undefined,
      plugins,
      content: {
        notes: request.notes,
        keywords: request.keywords,
        imageCaption,
        region: request.region,
        link: request.link,
      },
    });

    // 5) 토큰 길이 가드 (대략적인 체크)
    const estimatedTokens = prompt.length / 4; // 대략 1토큰 = 4글자
    if (estimatedTokens > 30000) {
      return res.status(400).json({ error: 'Prompt too long. Please reduce input size.' });
    }

    // 6) Google AI SDK(Gemini) 호출
    let rawContent: string;
    try {
      if (imageBuffer) {
        const imageBase64 = imageBuffer.toString('base64');
        rawContent = await generateContent(prompt, `data:${imageMimeType};base64,${imageBase64}`);
      } else {
        rawContent = await generateContent(prompt);
      }
    } catch (error) {
      console.error('Error generating content with AI:', error);
      return res.status(500).json({
        error: `Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }

    // 7) postProcess() 적용
    const processed = await runPostProcess(rawContent, {
      domain,
      platform,
      region: request.region,
      keywords: request.keywords,
      link: request.link,
    });

    // 8) 결과 JSON 반환
    const result = {
      output: processed.output,
      hashtags: processed.hashtags,
      warnings: processed.warnings,
    };

    // 9) 로깅 (Prisma Generation)
    try {
      const userId = (req.headers['x-user-id'] as string) || 'anonymous';

      await prisma.generation.create({
        data: {
          userId,
          domainId: request.domainId,
          platformIds: [request.platformId],
          input: {
            notes: request.notes,
            keywords: request.keywords,
            brandName: request.brandName,
            region: request.region,
            link: request.link,
            plugins: request.plugins,
            hasImage: !!imageBuffer,
          },
          output: result,
          metadata: {
            imageUrl,
            plugins: plugins.map((p) => p.id),
            warnings: processed.warnings,
          },
        },
      });
    } catch (error) {
      console.error('Failed to log generation:', error);
      // 로깅 실패해도 응답은 반환
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in generate API:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
