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
import { 
  searchWeb, 
  formatSearchResultsForPrompt, 
  shouldSearchWeb, 
  buildSearchQuery 
} from '@/lib/webSearch';

/**
 * form-data 파싱
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

interface GenerateRequest {
  notes?: string;
  keywords?: string[];
  domainId: string;
  platformId: string;
  brandName?: string;
  region?: string;
  link?: string;
  voiceHints?: string[];
  plugins?: string[];
  enableSearch?: boolean; // 웹 검색 활성화 여부
}

/**
 * 콘텐츠 생성 핸들러
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS 헤더 추가 (필요한 경우)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.error(`[generate] Invalid method: ${req.method}, expected POST`);
    return res.status(405).json({ 
      error: `Method not allowed. Expected POST, got ${req.method}`,
      method: req.method 
    });
  }

  try {
    // form-data 파싱
    const form = new IncomingForm({
      maxFileSize: 20 * 1024 * 1024, // 개별 파일 20MB
      maxTotalFileSize: 200 * 1024 * 1024, // 전체 업로드 합계 200MB
      keepExtensions: true,
    });

    let fields: any, files: any;
    try {
      [fields, files] = await form.parse(req);
    } catch (parseError) {
      console.error('Failed to parse form-data:', parseError);
      return res.status(400).json({
        error: `Failed to parse form data: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
      });
    }

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
      enableSearch: Array.isArray(fields.enableSearch) 
        ? fields.enableSearch[0] === 'true' 
        : fields.enableSearch === 'true',
    };

    // 필수 필드 검증
    if (!request.domainId || !request.platformId) {
      return res.status(400).json({ error: 'Missing required fields: domainId, platformId' });
    }

    // 이미지 처리 (최대 10장)
    const rawImageFiles =
      files.image && Array.isArray(files.image)
        ? files.image
        : files.image
        ? [files.image]
        : [];
    const limitedImageFiles = rawImageFiles.slice(0, 10);

    type ProcessedImage = {
      buffer: Buffer | Uint8Array;
      mimeType: string;
      url?: string;
    };

    const processedImages: ProcessedImage[] = [];

    for (const imageFile of limitedImageFiles) {
      try {
        const originalBuffer = await fs.readFile(imageFile.filepath);
        let mimeType = imageFile.mimetype || 'image/jpeg';
        let convertedBuffer: Buffer | Uint8Array = originalBuffer;

        // PNG를 JPEG로 변환 (Gemini API가 PNG를 완전히 지원하지 않음)
        try {
          const converted = await sharp(originalBuffer).jpeg({ quality: 90 }).toBuffer();
          convertedBuffer = new Uint8Array(converted);
          mimeType = 'image/jpeg';
        } catch (convertError) {
          console.error('Failed to convert image:', convertError);
        }

        let imageUrl: string | undefined;
        try {
          const fileName = `${uuidv4()}.jpg`;
          imageUrl = await uploadImage(convertedBuffer, fileName, mimeType);
        } catch (uploadError) {
          console.error('Failed to upload image:', uploadError);
        }

        processedImages.push({
          buffer: convertedBuffer,
          mimeType,
          url: imageUrl,
        });
      } catch (error) {
        console.error('Failed to process image:', error);
      }
    }

    // 1) 도메인/플랫폼 JSON 로드
    const domain = loadDomainProfile(request.domainId);
    const platform = loadPlatformTemplate(request.platformId);

    // 2) 선택 플러그인 renderGuide 합치기
    const plugins = request.plugins && request.plugins.length > 0 ? getPlugins(request.plugins) : [];

    // 2.5) 웹 검색 수행 (옵션)
    let searchContext: string | undefined;
    if (
      request.enableSearch &&
      shouldSearchWeb(request.notes, request.keywords) &&
      request.brandName &&
      request.region
    ) {
      try {
        const searchQuery = buildSearchQuery(
          request.notes,
          request.keywords,
          request.domainId,
          request.brandName,
          request.region
        );
        const searchResults = await searchWeb({
          query: searchQuery,
          maxResults: 5,
          domain: request.domainId,
        });
        
        if (searchResults.length > 0) {
          searchContext = formatSearchResultsForPrompt(searchResults);
          console.log(`Web search completed: Found ${searchResults.length} results`);
        }
      } catch (error) {
        console.error('Failed to search web:', error);
        // 검색 실패해도 계속 진행
      }
    }

    // 3) 이미지 분석 (이미지가 있는 경우)
    const imageCaptions: string[] = [];
    if (processedImages.length > 0) {
      for (const image of processedImages) {
        try {
          const imageBase64 = image.buffer.toString('base64');
          const analysisPrompt = createImageAnalysisPrompt(domain, request.notes);
          const caption = await analyzeImage(`data:${image.mimeType};base64,${imageBase64}`, analysisPrompt);
          if (caption) {
            imageCaptions.push(caption);
          }
        } catch (error) {
          console.error('Failed to analyze image:', error);
        }
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
      searchContext, // 웹 검색 결과 포함
      content: {
        notes: request.notes,
        keywords: request.keywords,
        imageCaptions,
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
      if (processedImages.length > 0) {
        const primaryImage = processedImages[0];
        const imageBase64 = primaryImage.buffer.toString('base64');
        rawContent = await generateContent(prompt, `data:${primaryImage.mimeType};base64,${imageBase64}`);
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
    const imageUrls = processedImages.map((image) => image.url).filter((url): url is string => Boolean(url));

    const result = {
      output: processed.output,
      hashtags: processed.hashtags,
      warnings: processed.warnings,
      imageUrls,
      imageCaptions,
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
            hasImage: processedImages.length > 0,
          },
          output: result,
          metadata: {
            imageUrls,
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
