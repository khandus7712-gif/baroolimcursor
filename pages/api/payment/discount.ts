/**
 * 할인 정보 확인 API
 * 사전예약자 할인 적용 여부 확인
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { calculateDiscount } from '@/lib/discount';

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

    const { planId } = req.body;

    // 플랜 유효성 검증
    if (!planId || !PLANS[planId]) {
      return res.status(400).json({ error: '유효하지 않은 플랜입니다.' });
    }

    const originalPrice = PLANS[planId].price;

    // 할인 계산
    const discountInfo = await calculateDiscount(originalPrice, session.user.email);

    return res.status(200).json({
      originalAmount: discountInfo.originalPrice,
      discountAmount: discountInfo.discountAmount,
      finalAmount: discountInfo.finalPrice,
      discountRate: discountInfo.discountRate,
      isDiscountApplied: discountInfo.isEligible,
    });
  } catch (error) {
    console.error('Discount API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}



