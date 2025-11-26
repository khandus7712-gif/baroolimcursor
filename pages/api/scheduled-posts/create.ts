/**
 * 예약 발행 생성 API
 * POST /api/scheduled-posts/create
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
    const {
      userId,
      domainId,
      platformIds,
      content,
      imageUrl,
      scheduledFor,
      memo,
      notifyBefore = 10,
    } = req.body;

    // 필수 필드 검증
    if (!userId || !domainId || !platformIds || !content || !scheduledFor) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }

    // 예약 시간이 현재 시간보다 이후인지 확인
    const scheduledDate = new Date(scheduledFor);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({ error: '예약 시간은 현재 시간 이후여야 합니다.' });
    }

    // 예약 생성
    const scheduledPost = await prisma.scheduledPost.create({
      data: {
        userId,
        domainId,
        platformIds,
        content,
        imageUrl,
        scheduledFor: scheduledDate,
        memo,
        notifyBefore,
        status: 'PENDING',
      },
    });

    res.status(201).json({
      success: true,
      scheduledPost,
    });
  } catch (error) {
    console.error('예약 생성 실패:', error);
    res.status(500).json({ error: '예약 생성에 실패했습니다.' });
  }
}












