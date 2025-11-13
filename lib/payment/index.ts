/**
 * Payment Provider Factory
 * 환경에 따라 적절한 결제 프로바이더 반환
 */

import { MockPaymentProvider } from './mockPaymentProvider';
import type { PaymentProvider } from '@/types/payment';

/**
 * 결제 프로바이더 가져오기
 * 현재는 Mock만 구현되어 있음
 * @returns 결제 프로바이더 인스턴스
 */
export function getPaymentProvider(): PaymentProvider {
  // 환경 변수에 따라 실제 결제 프로바이더 선택 가능
  const provider = process.env.PAYMENT_PROVIDER || 'mock';

  switch (provider) {
    case 'mock':
      return new MockPaymentProvider();
    // case 'stripe':
    //   return new StripePaymentProvider();
    // case 'toss':
    //   return new TossPaymentProvider();
    default:
      return new MockPaymentProvider();
  }
}

/**
 * 사용자 구독 상태 확인
 * @param userId - 사용자 ID
 * @returns 구독이 활성화되어 있는지 여부
 */
export async function isUserSubscribed(userId: string): Promise<boolean> {
  const { prisma } = await import('@/lib/prisma');

  const subscription = await prisma.userSubscription.findFirst({
    where: {
      userId,
      status: 'active',
      OR: [
        { endDate: null },
        { endDate: { gt: new Date() } },
      ],
    },
  });

  return !!subscription;
}

/**
 * 사용자 패스 사용 가능 여부 확인
 * @param userId - 사용자 ID
 * @returns 패스가 있는지 여부
 */
export async function hasUserPass(userId: string): Promise<boolean> {
  const { prisma } = await import('@/lib/prisma');

  const pass = await prisma.userPass.findFirst({
    where: {
      userId,
      remainingUses: { gt: 0 },
      OR: [
        { expiryDate: null },
        { expiryDate: { gt: new Date() } },
      ],
    },
  });

  return !!pass;
}

/**
 * 패스 사용 (콘텐츠 생성 시 호출)
 * @param userId - 사용자 ID
 * @returns 사용 성공 여부
 */
export async function useUserPass(userId: string): Promise<boolean> {
  const { prisma } = await import('@/lib/prisma');

  const pass = await prisma.userPass.findFirst({
    where: {
      userId,
      remainingUses: { gt: 0 },
      OR: [
        { expiryDate: null },
        { expiryDate: { gt: new Date() } },
      ],
    },
    orderBy: {
      purchaseDate: 'desc',
    },
  });

  if (!pass) {
    return false;
  }

  await prisma.userPass.update({
    where: { id: pass.id },
    data: {
      remainingUses: {
        decrement: 1,
      },
    },
  });

  return true;
}

