/**
 * 사용자 프로필 API
 * 자신의 정보 조회
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
    // 인증 확인
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        planExpiry: true,
        totalGenerations: true,
        dailyGenerationCount: true,
        lastGenerationDate: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

