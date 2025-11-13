/**
 * 알림 체크 API (Cron Job용)
 * GET /api/scheduled-posts/check-notifications
 * 
 * Vercel Cron으로 1분마다 호출됨
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { sendNotification } from '../../../lib/notifications';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = new Date();

    // 알림을 보내야 하는 예약들 찾기
    // 1. status가 PENDING
    // 2. scheduledFor - notifyBefore 분이 현재 시간보다 이전
    const scheduledPosts = await prisma.scheduledPost.findMany({
      where: {
        status: 'PENDING',
      },
    });

    const postsToNotify = scheduledPosts.filter((post) => {
      const notifyTime = new Date(post.scheduledFor);
      notifyTime.setMinutes(notifyTime.getMinutes() - post.notifyBefore);
      return notifyTime <= now;
    });

    // 알림 보내기
    const notifiedIds: string[] = [];
    for (const post of postsToNotify) {
      // 사용자 정보 조회
      const user = await prisma.user.findUnique({
        where: { id: post.userId },
      });

      if (!user) {
        console.error(`사용자를 찾을 수 없음: ${post.userId}`);
        continue;
      }

      // 알림 발송
      try {
        const results = await sendNotification(
          user.id,
          user.email || '',
          null, // TODO: 사용자 전화번호 (User 모델에 추가 필요)
          {
            scheduledPostId: post.id,
            userId: post.userId,
            scheduledFor: post.scheduledFor,
            memo: post.memo || undefined,
            notifyBefore: post.notifyBefore,
          }
        );

        console.log(`✅ 알림 발송 완료: ${post.id}`, results);

        // 상태 업데이트
        await prisma.scheduledPost.update({
          where: { id: post.id },
          data: {
            status: 'NOTIFIED',
            notifiedAt: new Date(),
          },
        });

        notifiedIds.push(post.id);
      } catch (error) {
        console.error(`알림 발송 실패: ${post.id}`, error);
      }
    }

    res.status(200).json({
      success: true,
      notifiedCount: notifiedIds.length,
      notifiedIds,
      message: `${notifiedIds.length}개의 알림을 발송했습니다.`,
    });
  } catch (error) {
    console.error('알림 체크 실패:', error);
    res.status(500).json({ error: '알림 체크에 실패했습니다.' });
  }
}

