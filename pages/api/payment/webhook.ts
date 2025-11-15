/**
 * 토스페이먼츠 웹훅 API
 * 결제 상태 변경 알림 수신
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { eventType, data } = req.body;

    console.log('Toss Payments Webhook:', {
      eventType,
      orderId: data?.orderId,
      status: data?.status,
    });

    // 이벤트 타입별 처리
    switch (eventType) {
      case 'PAYMENT_COMPLETED':
        // 결제 완료 (이미 /confirm에서 처리됨)
        break;

      case 'PAYMENT_CANCELED':
        // 결제 취소
        // TODO: DB에서 해당 결제 찾아서 상태 업데이트
        console.log('Payment canceled:', data?.orderId);
        break;

      case 'PAYMENT_FAILED':
        // 결제 실패
        console.log('Payment failed:', data?.orderId);
        break;

      case 'REFUND_COMPLETED':
        // 환불 완료
        // TODO: 사용자 플랜을 FREE로 다운그레이드
        console.log('Refund completed:', data?.orderId);
        break;

      default:
        console.log('Unknown webhook event:', eventType);
    }

    // 웹훅은 항상 200 응답 (토스페이먼츠 재전송 방지)
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // 웹훅은 에러가 나도 200 응답
    return res.status(200).json({ received: true, error: true });
  }
}

