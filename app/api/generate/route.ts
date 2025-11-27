/**
 * Content Generation API Route
 * POST /api/generate
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { loadDomainProfile, loadPlatformTemplate } from '@/lib/profileLoader';
import { composePrompt, createImageAnalysisPrompt } from '@/lib/promptComposer';
import { generateContent } from '@/lib/ai';
import { runPostProcess } from '@/lib/postProcess';
import { searchWeb, formatSearchResultsForPrompt, buildSearchQuery } from '@/lib/webSearch';
import { getPlugins } from '@/plugins/hashtag';

export async function POST(request: NextRequest) {
  try {
    // 사용자 인증 확인
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 사용자 정보 조회 (플랜 및 생성 횟수 확인)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        totalGenerations: true,
        dailyGenerationCount: true,
        lastGenerationDate: true,
        planExpiry: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: '사용자 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 단건 구매 결제 내역 확인 (사용하지 않은 단건 구매가 있는지)
    // 먼저 모든 단건 구매를 가져온 후 JavaScript에서 필터링
    const singlePayments = await prisma.payment.findMany({
      where: {
        userId,
        planId: 'SINGLE_CONTENT',
        status: 'COMPLETED',
      },
      orderBy: {
        paidAt: 'desc',
      },
    });

    // metadata에 used가 없거나 false인 경우만 필터링
    const unusedSinglePayment = singlePayments.find((payment) => {
      if (!payment.metadata) return true;
      const metadata = payment.metadata as any;
      return !metadata.used || metadata.used === false;
    });

    // 단건 구매가 있으면 사용 가능 (플랜 제한 무시)
    let hasSingleContent = !!unusedSinglePayment;

    // FREE 플랜인 경우 5회 제한 체크 (단건 구매가 없을 때만)
    if (user.plan === 'FREE' && !hasSingleContent) {
      const FREE_LIMIT = 5;
      if (user.totalGenerations >= FREE_LIMIT) {
        return NextResponse.json(
          { 
            error: `무료 플랜은 평생 5회까지만 생성 가능합니다. (현재: ${user.totalGenerations}회)`,
            limitReached: true,
            currentCount: user.totalGenerations,
            limit: FREE_LIMIT,
          },
          { status: 403 }
        );
      }
    }

    // 유료 플랜인 경우 만료일 및 일일 제한 체크
    if (user.plan !== 'FREE') {
      // 플랜 만료 체크
      if (user.planExpiry) {
        const now = new Date();
        if (new Date(user.planExpiry) < now) {
          // 플랜이 만료된 경우 FREE로 다운그레이드
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: 'FREE',
              planExpiry: null,
            },
          });
          
          return NextResponse.json(
            { 
              error: '구독이 만료되었습니다. 무료 플랜으로 전환되었습니다. (평생 5회 제한)',
              planExpired: true,
              newPlan: 'FREE',
            },
            { status: 403 }
          );
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastGenDate = user.lastGenerationDate ? new Date(user.lastGenerationDate) : null;
      const isNewDay = !lastGenDate || lastGenDate < today;

      // 일일 제한 설정
      const dailyLimits: Record<string, number> = {
        BASIC: 3,
        PRO: 10,
        ENTERPRISE: 30,
      };

      const dailyLimit = dailyLimits[user.plan] || 0;

      if (isNewDay) {
        // 새 날이면 카운트 리셋
        await prisma.user.update({
          where: { id: userId },
          data: {
            dailyGenerationCount: 0,
            lastGenerationDate: today,
          },
        });
        user.dailyGenerationCount = 0;
      }

      if (user.dailyGenerationCount >= dailyLimit) {
        return NextResponse.json(
          { 
            error: `${user.plan} 플랜은 하루 ${dailyLimit}회까지만 생성 가능합니다. (현재: ${user.dailyGenerationCount}회)`,
            limitReached: true,
            currentCount: user.dailyGenerationCount,
            limit: dailyLimit,
          },
          { status: 403 }
        );
      }
    }

    // Parse FormData
    const formData = await request.formData();
    
    const domainId = formData.get('domainId') as string;
    const platformId = formData.get('platformId') as string;
    const notes = formData.get('notes') as string | null;
    const brandName = formData.get('brandName') as string | null;
    const region = formData.get('region') as string | null;
    const link = formData.get('link') as string | null;
    const enableSearch = formData.get('enableSearch') === 'true';
    
    // Get arrays from FormData
    const keywords: string[] = [];
    formData.getAll('keywords').forEach((k) => {
      if (typeof k === 'string' && k.trim()) {
        keywords.push(k.trim());
      }
    });
    
    const voiceHints: string[] = [];
    formData.getAll('voiceHints').forEach((h) => {
      if (typeof h === 'string' && h.trim()) {
        voiceHints.push(h.trim());
      }
    });
    
    const pluginIds: string[] = [];
    formData.getAll('plugins').forEach((p) => {
      if (typeof p === 'string' && p.trim()) {
        pluginIds.push(p.trim());
      }
    });
    
    // Get image files
    const imageFiles: File[] = [];
    formData.getAll('image').forEach((file) => {
      if (file instanceof File) {
        imageFiles.push(file);
      }
    });
    
    // Validate required fields
    if (!domainId || !platformId) {
      return NextResponse.json(
        { error: '도메인과 플랫폼을 선택해주세요.' },
        { status: 400 }
      );
    }
    
    // Load domain and platform profiles
    const domain = loadDomainProfile(domainId);
    const platform = loadPlatformTemplate(platformId);
    
    // Load plugins
    const plugins = pluginIds.length > 0 ? getPlugins(pluginIds) : [];
    
    // Process images: convert to base64 and analyze
    let imageBase64: string | undefined;
    const imageCaptions: string[] = [];
    
    if (imageFiles.length > 0) {
      // Use the first image for now (can be extended to handle multiple images)
      const firstImage = imageFiles[0];
      const arrayBuffer = await firstImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');
      const mimeType = firstImage.type || 'image/jpeg';
      imageBase64 = `data:${mimeType};base64,${base64}`;
      
      // Analyze image(s) to generate captions
      try {
        const imageAnalysisPrompt = createImageAnalysisPrompt(domain, notes || undefined);
        const caption = await generateContent(imageAnalysisPrompt, imageBase64);
        imageCaptions.push(caption);
      } catch (error) {
        console.error('Error analyzing image:', error);
        // Continue without image captions if analysis fails
      }
    }
    
    // Web search if enabled
    let searchContext: string | undefined;
    if (enableSearch && (brandName || region || keywords.length > 0 || notes)) {
      try {
        const searchQuery = buildSearchQuery(notes || undefined, keywords, domainId, brandName || undefined, region || undefined);
        if (searchQuery) {
          const searchResults = await searchWeb({
            query: searchQuery,
            maxResults: 5,
            domain: domainId,
          });
          if (searchResults.length > 0) {
            searchContext = formatSearchResultsForPrompt(searchResults);
          }
        }
      } catch (error) {
        console.error('Error performing web search:', error);
        // Continue without search context if search fails
      }
    }
    
    // Build brand object
    const brand = brandName ? {
      name: brandName,
      tone: '', // Can be extended
      keywords: keywords,
      voiceHints: voiceHints.length > 0 ? voiceHints : undefined,
    } : undefined;
    
    // Compose prompt
    const prompt = composePrompt({
      domain,
      platform,
      brand,
      plugins,
      content: {
        notes: notes || undefined,
        keywords: keywords.length > 0 ? keywords : undefined,
        imageCaptions: imageCaptions.length > 0 ? imageCaptions : undefined,
        region: region || undefined,
        link: link || undefined,
      },
      searchContext,
    });
    
    // Generate content
    const generatedText = await generateContent(prompt, imageBase64);
    
    // Post-process content
    const postProcessResult = await runPostProcess(generatedText, {
      domain,
      platform,
      region: region || undefined,
      keywords: keywords.length > 0 ? keywords : undefined,
      link: link || undefined,
    });
    
    // 단건 구매 사용 처리
    if (hasSingleContent && unusedSinglePayment) {
      // 단건 구매 사용 표시 (metadata에 사용 여부 저장)
      await prisma.payment.update({
        where: { id: unusedSinglePayment.id },
        data: {
          metadata: {
            ...(unusedSinglePayment.metadata as any || {}),
            used: true,
            usedAt: new Date().toISOString(),
          },
        },
      });
    } else {
      // 일반 플랜 생성 횟수 업데이트
      if (user.plan === 'FREE') {
        // FREE 플랜: totalGenerations 증가
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalGenerations: {
              increment: 1,
            },
          },
        });
      } else {
        // 유료 플랜: dailyGenerationCount 증가 및 lastGenerationDate 업데이트
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        await prisma.user.update({
          where: { id: userId },
          data: {
            dailyGenerationCount: {
              increment: 1,
            },
            lastGenerationDate: today,
          },
        });
      }
    }

    // Build response
    const result = {
      output: postProcessResult.output,
      hashtags: postProcessResult.hashtags,
      warnings: postProcessResult.warnings,
      imageUrls: [], // Can be extended to store uploaded images
      imageCaptions: imageCaptions.length > 0 ? imageCaptions : undefined,
    };
    
    return NextResponse.json(result, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
  } catch (error) {
    console.error('Error generating content:', error);
    
    let errorMessage = '콘텐츠 생성에 실패했습니다.';
    if (error instanceof Error) {
      // 환경 변수 관련 에러를 더 명확하게 표시
      if (error.message.includes('GOOGLE_API_KEY')) {
        errorMessage = '서버 설정 오류: Google AI API 키가 설정되지 않았습니다. 관리자에게 문의하세요.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

