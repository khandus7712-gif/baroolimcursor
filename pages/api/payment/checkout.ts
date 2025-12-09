/**
 * 결제 준비 API
 * 주문 ID 생성 및 결제 정보 반환
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PLANS: Record<string, { name: string; price: number }> = {
  SINGLE_CONTENT: { name: '단건 콘텐츠', price: 990 },
  BASIC: { name: 'Starter 플랜', price: 49900 },
  PRO: { name: 'Growth 플랜', price: 79000 },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 인증 확인
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    const { planId, amount } = req.body;

    // 플랜 유효성 검증
    if (!planId || !PLANS[planId]) {
      return res.status(400).json({ error: '유효하지 않은 플랜입니다.' });
    }

    // 금액 검증 (변조 방지)
    if (amount !== PLANS[planId].price) {
      return res.status(400).json({ error: '결제 금액이 일치하지 않습니다.' });
    }

    // 주문 ID 생성 (고유값)
    const orderId = `ORDER_${session.user.id}_${Date.now()}`;
    const orderName = `바로올림 ${PLANS[planId].name}`;

    // TODO: 주문 정보를 DB에 임시 저장 (결제 완료 후 매칭용)
    // await prisma.order.create({
    //   data: {
    //     orderId,
    //     userId: session.user.id,
    //     planId,
    //     amount,
    //     status: 'PENDING',
    //   },
    // });

    return res.status(200).json({
      orderId,
      orderName,
      amount,
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

