/**
 * 콘텐츠 생성 API (App Router)
 * form-data로 이미지와 메모를 받아 AI로 콘텐츠 생성
 */

import { NextRequest, NextResponse } from 'next/server';
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
  enableSearch?: boolean;
}

/**
 * 콘텐츠 생성 핸들러 (POST)
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[generate] POST request received');
    
    // form-data 파싱
    const formData = await request.formData();
    
    // 요청 데이터 추출
    const requestData: GenerateRequest = {
      domainId: formData.get('domainId') as string || '',
      platformId: formData.get('platformId') as string || '',
      notes: formData.get('notes') as string || undefined,
      keywords: formData.getAll('keywords').map(k => k.toString()),
      brandName: formData.get('brandName') as string || undefined,
      region: formData.get('region') as string || undefined,
      link: formData.get('link') as string || undefined,
      voiceHints: formData.getAll('voiceHints').map(h => h.toString()),
      plugins: formData.getAll('plugins').map(p => p.toString()),
      enableSearch: formData.get('enableSearch') === 'true',
    };

    // 필수 필드 검증
    if (!requestData.domainId || !requestData.platformId) {
      return NextResponse.json(
        { error: 'Missing required fields: domainId, platformId' },
        { status: 400 }
      );
    }

    // 이미지 처리 (최대 10장)
    const imageFiles = formData.getAll('image').filter(
      (file): file is File => file instanceof File
    ).slice(0, 10);

    type ProcessedImage = {
      buffer: Buffer | Uint8Array;
      mimeType: string;
      url?: string;
    };

    const processedImages: ProcessedImage[] = [];

    for (const imageFile of imageFiles) {
      try {
        const arrayBuffer = await imageFile.arrayBuffer();
        const originalBuffer = Buffer.from(arrayBuffer);
        let mimeType = imageFile.type || 'image/jpeg';
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
    const domain = loadDomainProfile(requestData.domainId);
    const platform = loadPlatformTemplate(requestData.platformId);

    // 2) 선택 플러그인 renderGuide 합치기
    const plugins = requestData.plugins && requestData.plugins.length > 0 
      ? getPlugins(requestData.plugins) 
      : [];

    // 2.5) 웹 검색 수행 (옵션)
    let searchContext: string | undefined;
    if (
      requestData.enableSearch &&
      shouldSearchWeb(requestData.notes, requestData.keywords) &&
      requestData.brandName &&
      requestData.region
    ) {
      try {
        const searchQuery = buildSearchQuery(
          requestData.notes,
          requestData.keywords,
          requestData.domainId,
          requestData.brandName,
          requestData.region
        );
        const searchResults = await searchWeb({
          query: searchQuery,
          maxResults: 5,
          domain: requestData.domainId,
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
          const analysisPrompt = createImageAnalysisPrompt(domain, requestData.notes);
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
      brand: requestData.brandName
        ? {
            name: requestData.brandName,
            tone: requestData.voiceHints?.[0],
            keywords: requestData.keywords,
            voiceHints: requestData.voiceHints,
          }
        : undefined,
      plugins,
      searchContext, // 웹 검색 결과 포함
      content: {
        notes: requestData.notes,
        keywords: requestData.keywords,
        imageCaptions,
        region: requestData.region,
        link: requestData.link,
      },
    });

    // 5) 토큰 길이 가드 (대략적인 체크)
    const estimatedTokens = prompt.length / 4; // 대략 1토큰 = 4글자
    if (estimatedTokens > 30000) {
      return NextResponse.json(
        { error: 'Prompt too long. Please reduce input size.' },
        { status: 400 }
      );
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
      return NextResponse.json(
        { error: `Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }

    // 7) postProcess() 적용
    const processed = await runPostProcess(rawContent, {
      domain,
      platform,
      region: requestData.region,
      keywords: requestData.keywords,
      link: requestData.link,
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
      const userId = request.headers.get('x-user-id') || 'anonymous';

      await prisma.generation.create({
        data: {
          userId,
          domainId: requestData.domainId,
          platformIds: [requestData.platformId],
          input: {
            notes: requestData.notes,
            keywords: requestData.keywords,
            brandName: requestData.brandName,
            region: requestData.region,
            link: requestData.link,
            plugins: requestData.plugins,
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

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error in generate API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS 요청 처리 (CORS preflight)
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-user-id',
    },
  });
}

