/**
 * 사용자 플랜 정보 조회 API
 * GET /api/user/plan
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        plan: true,
        planExpiry: true,
        totalGenerations: true,
        dailyGenerationCount: true,
        lastGenerationDate: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json({
      plan: user.plan,
      planExpiry: user.planExpiry,
      totalGenerations: user.totalGenerations,
      dailyGenerationCount: user.dailyGenerationCount,
      lastGenerationDate: user.lastGenerationDate,
    });
  } catch (error) {
    console.error('User plan API error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : '서버 오류가 발생했습니다.' 
    });
  }
}

