/**
 * 예약 발행 수정 API
 * PUT /api/scheduled-posts/[id]/update
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const {
      scheduledFor,
      memo,
      notifyBefore,
      status,
    } = req.body;

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

    // 수정 데이터 구성
    const updateData: any = {};
    if (scheduledFor) {
      const newDate = new Date(scheduledFor);
      if (newDate <= new Date()) {
        return res.status(400).json({ error: '예약 시간은 현재 시간 이후여야 합니다.' });
      }
      updateData.scheduledFor = newDate;
    }
    if (memo !== undefined) updateData.memo = memo;
    if (notifyBefore !== undefined) updateData.notifyBefore = notifyBefore;
    if (status) updateData.status = status;

    // 수정
    const updated = await prisma.scheduledPost.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      scheduledPost: updated,
    });
  } catch (error) {
    console.error('예약 수정 실패:', error);
    res.status(500).json({ error: '예약 수정에 실패했습니다.' });
  }
}




