/**
 * 예약 발행 목록 조회 API
 * GET /api/scheduled-posts/list?userId=xxx
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, status } = req.query;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId가 필요합니다.' });
    }

    // 필터 조건
    const where: any = {
      userId,
    };

    if (status && typeof status === 'string') {
      where.status = status;
    } else {
      // 기본적으로 PENDING과 NOTIFIED만 조회
      where.status = { in: ['PENDING', 'NOTIFIED'] };
    }

    // 예약 목록 조회 (날짜순 정렬)
    const scheduledPosts = await prisma.scheduledPost.findMany({
      where,
      orderBy: {
        scheduledFor: 'asc',
      },
    });

    // 날짜별로 그룹화
    const groupedByDate: Record<string, typeof scheduledPosts> = {};
    scheduledPosts.forEach((post) => {
      const dateKey = post.scheduledFor.toISOString().split('T')[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = [];
      }
      groupedByDate[dateKey].push(post);
    });

    res.status(200).json({
      success: true,
      scheduledPosts,
      groupedByDate,
      total: scheduledPosts.length,
    });
  } catch (error) {
    console.error('예약 목록 조회 실패:', error);
    res.status(500).json({ error: '예약 목록 조회에 실패했습니다.' });
  }
}






