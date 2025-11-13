/**
 * 예약 즉시 발행 API (상태 변경)
 * POST /api/scheduled-posts/[id]/publish
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID가 필요합니다.' });
    }

    // 예약 존재 확인
    const scheduledPost = await prisma.scheduledPost.findUnique({
      where: { id },
    });

    if (!scheduledPost) {
      return res.status(404).json({ error: '예약을 찾을 수 없습니다.' });
    }

    if (scheduledPost.status === 'PUBLISHED') {
      return res.status(400).json({ error: '이미 발행된 콘텐츠입니다.' });
    }

    if (scheduledPost.status === 'CANCELLED') {
      return res.status(400).json({ error: '취소된 콘텐츠는 발행할 수 없습니다.' });
    }

    // 상태를 PUBLISHED로 변경
    const published = await prisma.scheduledPost.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    res.status(200).json({
      success: true,
      message: '발행 완료 처리되었습니다.',
      scheduledPost: published,
    });
  } catch (error) {
    console.error('발행 처리 실패:', error);
    res.status(500).json({ error: '발행 처리에 실패했습니다.' });
  }
}


