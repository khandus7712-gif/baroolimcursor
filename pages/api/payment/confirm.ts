/**
 * 결제 승인 API
 * 토스페이먼츠 결제 검증 및 구독 활성화
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const PLANS: Record<string, { name: string; price: number; plan: string | null }> = {
  SINGLE_CONTENT: { name: '단건 콘텐츠', price: 990, plan: null }, // 단건 구매는 플랜 변경 없음
  BASIC: { name: '베이직', price: 29900, plan: 'BASIC' },
  PRO: { name: '프로', price: 49900, plan: 'PRO' },
  ENTERPRISE: { name: '엔터프라이즈', price: 79900, plan: 'ENTERPRISE' },
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

    const { paymentKey, orderId, amount } = req.body;

    if (!paymentKey || !orderId || !amount) {
      return res.status(400).json({ error: '필수 파라미터가 누락되었습니다.' });
    }

    // 토스페이먼츠 시크릿 키
    const secretKey = process.env.TOSS_SECRET_KEY;
    
    if (!secretKey) {
      console.error('TOSS_SECRET_KEY not configured');
      return res.status(500).json({ error: '결제 시스템 설정이 완료되지 않았습니다.' });
    }

    // 토스페이먼츠 결제 승인 API 호출
    const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    if (!tossResponse.ok) {
      const errorData = await tossResponse.json();
      console.error('Toss payment confirmation failed:', errorData);
      return res.status(400).json({ 
        error: errorData.message || '결제 승인에 실패했습니다.',
        code: errorData.code,
      });
    }

    const paymentData = await tossResponse.json();

    // orderId에서 플랜 정보 추출 (실제로는 DB에 저장된 주문 정보를 조회해야 함)
    // 현재는 간단하게 금액으로 플랜 판별
    let planId = 'BASIC';
    let planInfo = PLANS.BASIC;
    
    for (const [key, info] of Object.entries(PLANS)) {
      if (info.price === amount) {
        planId = key;
        planInfo = info;
        break;
      }
    }

    // 단건 구매가 아닌 경우에만 플랜 업데이트
    if (planInfo.plan) {
      // 구독 만료일 계산 (1개월 후)
      const planExpiry = new Date();
      planExpiry.setMonth(planExpiry.getMonth() + 1);

      // 사용자 플랜 업데이트
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          plan: planInfo.plan as any,
          planExpiry,
          // 일일 카운트 초기화
          dailyGenerationCount: 0,
          lastGenerationDate: new Date(),
        },
      });
    }
    // 단건 구매(SINGLE_CONTENT)는 플랜을 변경하지 않음 (결제 내역만 저장)

    // 결제 내역을 DB에 저장
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        orderId,
        paymentKey,
        planId,
        planName: planInfo.name,
        amount,
        status: 'COMPLETED',
        paidAt: new Date(paymentData.approvedAt),
        metadata: paymentData as any,
      },
    });

    return res.status(200).json({
      success: true,
      orderId,
      amount,
      planName: planInfo.name,
      approvedAt: paymentData.approvedAt,
    });
  } catch (error) {
    console.error('Payment confirm API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

