/**
 * Content Generation API Route
 * POST /api/generate
 */

import { NextRequest, NextResponse } from 'next/server';
import { loadDomainProfile, loadPlatformTemplate } from '@/lib/profileLoader';
import { composePrompt, createImageAnalysisPrompt } from '@/lib/promptComposer';
import { generateContent } from '@/lib/ai';
import { runPostProcess } from '@/lib/postProcess';
import { searchWeb, formatSearchResultsForPrompt, buildSearchQuery } from '@/lib/webSearch';
import { getPlugins } from '@/plugins/hashtag';

export async function POST(request: NextRequest) {
  try {
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

