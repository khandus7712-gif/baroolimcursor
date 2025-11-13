/**
 * 온보딩 데이터 저장 API
 * DomainConfig/PlatformConfig 사용자 커스텀을 DB에 JSON으로 기록
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // TODO: 실제 인증 구현 필요
    const userId = (req.headers['x-user-id'] as string) || 'anonymous';

    const { domainId, kpis, tone, forbiddenWords, cta, brandName } = req.body;

    if (!domainId) {
      return res.status(400).json({ error: 'domainId is required' });
    }

    // 도메인 프로필 로드
    const { loadDomainProfile } = await import('@/lib/profileLoader');
    const baseDomainProfile = loadDomainProfile(domainId);

    // 사용자 커스텀 설정으로 도메인 프로필 수정
    const customDomainConfig = {
      ...baseDomainProfile,
      kpis: kpis || baseDomainProfile.kpis,
      tone: tone
        ? {
            ...baseDomainProfile.tone,
            brandVoiceDesc: tone,
          }
        : baseDomainProfile.tone,
      bannedPhrases: forbiddenWords
        ? [...(baseDomainProfile.bannedPhrases || []), ...forbiddenWords]
        : baseDomainProfile.bannedPhrases,
      sampleCTAs: cta ? [cta, ...(baseDomainProfile.sampleCTAs || [])] : baseDomainProfile.sampleCTAs,
    };

    // DomainConfig 저장 또는 업데이트
    await prisma.domainConfig.upsert({
      where: { domainId },
      update: {
        config: customDomainConfig as unknown as object,
      },
      create: {
        domainId,
        config: customDomainConfig as unknown as object,
      },
    });

    // 브랜드가 있으면 Brand도 생성
    if (brandName) {
      await prisma.brand.upsert({
        where: {
          id: `${userId}_${domainId}`,
        },
        update: {
          name: brandName,
          domainId,
          config: customDomainConfig as unknown as object,
        },
        create: {
          id: `${userId}_${domainId}`,
          userId,
          name: brandName,
          domainId,
          config: customDomainConfig as unknown as object,
        },
      });
    }

    return res.status(200).json({ success: true, domainId });
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}
