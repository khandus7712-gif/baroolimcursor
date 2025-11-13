/**
 * 예약 발행 삭제/취소 API
 * DELETE /api/scheduled-posts/[id]/delete
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'ID가 필요합니다.' });
    }

    // 예약 존재 확인
    const existing = await prisma.scheduledPost.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({ error: '예약을 찾을 수 없습니다.' });
    }

    // 완전 삭제 대신 상태를 CANCELLED로 변경 (히스토리 보존)
    const cancelled = await prisma.scheduledPost.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    res.status(200).json({
      success: true,
      message: '예약이 취소되었습니다.',
      scheduledPost: cancelled,
    });
  } catch (error) {
    console.error('예약 취소 실패:', error);
    res.status(500).json({ error: '예약 취소에 실패했습니다.' });
  }
}


