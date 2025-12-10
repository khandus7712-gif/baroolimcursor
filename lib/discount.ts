/**
 * 할인 관련 유틸리티 함수
 */

import { prisma } from '@/lib/prisma';

/**
 * 할인 기간 종료일 (2026년 1월 31일)
 */
export const DISCOUNT_END_DATE = new Date('2026-01-31T23:59:59.999Z');

/**
 * 할인율 (30%)
 */
export const DISCOUNT_RATE = 0.3;

/**
 * 사전예약자 여부 확인
 * @param email - 사용자 이메일
 * @returns 사전예약자 여부
 */
export async function isWaitlistMember(email: string | null | undefined): Promise<boolean> {
  if (!email) return false;

  try {
    const waitlist = await prisma.waitlist.findUnique({
      where: { email },
    });

    return !!waitlist;
  } catch (error) {
    console.error('Waitlist check error:', error);
    return false;
  }
}

/**
 * 할인 적용 가능 여부 확인
 * @param email - 사용자 이메일
 * @returns 할인 적용 가능 여부
 */
export async function isDiscountEligible(email: string | null | undefined): Promise<boolean> {
  // 할인 기간 확인
  const now = new Date();
  if (now > DISCOUNT_END_DATE) {
    return false;
  }

  // 사전예약자 확인
  return await isWaitlistMember(email);
}

/**
 * 할인 금액 계산
 * @param originalPrice - 원래 가격
 * @param email - 사용자 이메일 (선택사항, 없으면 할인 미적용)
 * @returns 할인된 가격과 할인 정보
 */
export async function calculateDiscount(
  originalPrice: number,
  email?: string | null
): Promise<{
  originalPrice: number;
  discountAmount: number;
  finalPrice: number;
  discountRate: number;
  isEligible: boolean;
}> {
  const isEligible = email ? await isDiscountEligible(email) : false;

  if (!isEligible) {
    return {
      originalPrice,
      discountAmount: 0,
      finalPrice: originalPrice,
      discountRate: 0,
      isEligible: false,
    };
  }

  const discountAmount = Math.floor(originalPrice * DISCOUNT_RATE);
  const finalPrice = originalPrice - discountAmount;

  return {
    originalPrice,
    discountAmount,
    finalPrice,
    discountRate: DISCOUNT_RATE,
    isEligible: true,
  };
}



