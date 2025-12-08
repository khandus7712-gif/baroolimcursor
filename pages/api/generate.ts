/**
 * 콘텐츠 생성 API
 * POST /api/generate
 * 
 * 플랜/패스 제한 체크 및 크레딧 차감 포함
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkGenerationLimit, deductGeneration } from '@/lib/credits';
import { canAccessDomain, type SubscriptionPlan } from '@/lib/profileLoader';
import { loadDomainProfile, loadPlatformTemplate } from '@/lib/profileLoader';
import { composePrompt } from '@/lib/promptComposer';
import { generateContent } from '@/lib/ai';
import { runPostProcess } from '@/lib/postProcess';
import { searchWeb, formatSearchResultsForPrompt, shouldSearchWeb, buildSearchQuery } from '@/lib/webSearch';
import { getPlugins } from '@/plugins/hashtag';
import { uploadBase64Image } from '@/lib/storage';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';

// FormData 파싱을 위해 bodyParser 비활성화
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * FormData 파싱
 */
async function parseFormData(req: NextApiRequest): Promise<{
  fields: Record<string, string | string[]>;
  files: Record<string, any>;
}> {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      // fields를 문자열 배열로 변환
      const parsedFields: Record<string, string | string[]> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (Array.isArray(value) && value.length === 1) {
          parsedFields[key] = value[0] as string;
        } else {
          parsedFields[key] = value as string[];
        }
      }

      resolve({ fields: parsedFields, files });
    });
  });
}

/**
 * 이미지 파일을 Base64로 변환
 */
async function fileToBase64(filePath: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);
  const base64 = fileBuffer.toString('base64');
  const mimeType = 'image/jpeg'; // 기본값, 실제로는 파일 확장자로 판단
  return `data:${mimeType};base64,${base64}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. 인증 확인
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const userId = session.user.id;

    // 2. FormData 파싱
    const { fields, files } = await parseFormData(req);

    const domainId = fields.domainId as string;
    const platformId = fields.platformId as string;
    const notes = fields.notes as string;
    const keywords = (fields.keywords as string)?.split(',').map(k => k.trim()).filter(k => k) || [];
    const brandName = fields.brandName as string;
    const region = fields.region as string;
    const link = fields.link as string;
    const voiceHints = (fields.voiceHints as string)?.split(',').map(h => h.trim()).filter(h => h) || [];
    const plugins = Array.isArray(fields.plugins) ? fields.plugins : fields.plugins ? [fields.plugins] : [];
    const enableSearch = fields.enableSearch === 'true';

    // 필수 필드 검증
    if (!domainId || !platformId || !notes) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다. (domainId, platformId, notes)' });
    }

    // 3. 업종 접근 권한 체크
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    // 플랜 타입 변환
    const userPlan = user.plan as SubscriptionPlan;
    
    if (!canAccessDomain(domainId, userPlan)) {
      return res.status(403).json({ 
        error: `해당 업종(${domainId})은 현재 플랜(${userPlan})에서 사용할 수 없습니다. 플랜을 업그레이드하세요.` 
      });
    }

    // 4. 크레딧 제한 체크
    const limitCheck = await checkGenerationLimit(userId);
    if (!limitCheck.canGenerate) {
      return res.status(403).json({ 
        error: limitCheck.error || '생성 횟수를 초과했습니다.',
        remaining: limitCheck.remaining || 0,
      });
    }

    // 5. 도메인 및 플랫폼 프로필 로드
    const domainProfile = loadDomainProfile(domainId);
    const platformTemplate = loadPlatformTemplate(platformId);

    // 6. 이미지 처리
    let imageBase64: string | undefined;
    let imageUrl: string | undefined;
    const imageFiles = Array.isArray(files.image) ? files.image : files.image ? [files.image] : [];
    
    if (imageFiles.length > 0) {
      const firstImage = imageFiles[0];
      const filePath = Array.isArray(firstImage) ? firstImage[0].filepath : firstImage.filepath;
      imageBase64 = await fileToBase64(filePath);
      
      // 이미지 업로드 (선택사항)
      try {
        imageUrl = await uploadBase64Image(imageBase64, `generated-${Date.now()}.jpg`);
      } catch (uploadError) {
        console.warn('Image upload failed, continuing without upload:', uploadError);
      }
    }

    // 7. 웹 검색 (선택사항)
    let searchContext: string | undefined;
    if (enableSearch && brandName && region) {
      try {
        const searchQuery = buildSearchQuery(notes, keywords, domainId, brandName, region);
        if (shouldSearchWeb(notes, keywords)) {
          const searchResults = await searchWeb({
            query: searchQuery,
            maxResults: 5,
            domain: domainId,
          });
          if (searchResults.length > 0) {
            searchContext = formatSearchResultsForPrompt(searchResults);
          }
        }
      } catch (searchError) {
        console.warn('Web search failed, continuing without search:', searchError);
      }
    }

    // 8. 플러그인 로드
    const pluginInstances = getPlugins(plugins as string[]);

    // 9. 프롬프트 생성
    const prompt = composePrompt({
      domain: domainProfile,
      platform: platformTemplate,
      brand: brandName ? {
        name: brandName,
        tone: voiceHints.join(', '),
        keywords,
        voiceHints,
      } : undefined,
      plugins: pluginInstances,
      content: {
        notes,
        keywords,
        region,
        link,
      },
      searchContext,
    });

    // 10. AI 콘텐츠 생성
    const generatedText = await generateContent(prompt, imageBase64);

    // 11. 후처리
    const processed = await runPostProcess(generatedText, {
      domain: domainProfile,
      platform: platformTemplate,
      region,
      keywords,
    });

    // 12. 크레딧 차감 (성공 후)
    await deductGeneration(userId);

    // 13. Generation 기록 저장 (선택사항)
    try {
      await prisma.generation.create({
        data: {
          userId,
          domainId,
          platformIds: [platformId],
          input: {
            notes,
            keywords,
            brandName,
            region,
            link,
            plugins,
            enableSearch,
          },
          output: {
            content: processed.output,
            hashtags: processed.hashtags,
            warnings: processed.warnings,
          },
          metadata: {
            imageUrl,
            platformId,
          },
        },
      });
    } catch (dbError) {
      console.warn('Failed to save generation record:', dbError);
      // DB 저장 실패해도 결과는 반환
    }

    // 14. 결과 반환
    return res.status(200).json({
      output: processed.output,
      hashtags: processed.hashtags,
      warnings: processed.warnings,
      imageUrl,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : '콘텐츠 생성에 실패했습니다.' 
    });
  }
}

