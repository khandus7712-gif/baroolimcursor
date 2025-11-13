/**
 * Mock Payment Provider
 * 개발 및 테스트용 Mock 결제 프로바이더
 */

import type { PaymentProvider, UserSubscription, UserPass, SubscriptionPlan, PassType } from '@/types/payment';
import { prisma } from '@/lib/prisma';

/**
 * Mock Payment Provider 구현
 */
export class MockPaymentProvider implements PaymentProvider {
  name = 'Mock Payment Provider';

  /**
   * 구독 생성
   * @param userId - 사용자 ID
   * @param plan - 구독 플랜
   * @returns 구독 ID 및 클라이언트 시크릿
   */
  async createSubscription(
    userId: string,
    plan: SubscriptionPlan
  ): Promise<{ subscriptionId: string; clientSecret?: string }> {
    // Mock: 바로 구독 생성 (실제로는 결제 프로세스 필요)
    const subscription = await prisma.userSubscription.create({
      data: {
        userId,
        plan,
        status: 'active',
        providerSubscriptionId: `mock_sub_${Date.now()}`,
        startDate: new Date(),
        endDate: plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
      },
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: undefined, // Mock에서는 불필요
    };
  }

  /**
   * 구독 취소
   * @param subscriptionId - 구독 ID
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    await prisma.userSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'canceled',
        endDate: new Date(),
      },
    });
  }

  /**
   * 구독 갱신
   * @param subscriptionId - 구독 ID
   */
  async renewSubscription(subscriptionId: string): Promise<void> {
    const subscription = await prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    await prisma.userSubscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'active',
        endDate: subscription.endDate
          ? new Date(subscription.endDate.getTime() + 30 * 24 * 60 * 60 * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  /**
   * 패스 구매
   * @param userId - 사용자 ID
   * @param passType - 패스 타입
   * @returns 패스 ID
   */
  async purchasePass(userId: string, passType: PassType): Promise<{ passId: string }> {
    // 패스 타입별 사용 횟수
    const passCounts: Record<PassType, number> = {
      single: 1,
      pack_10: 10,
      pack_50: 50,
      pack_100: 100,
    };

    const count = passCounts[passType];

    // Mock: 바로 패스 생성 (실제로는 결제 프로세스 필요)
    const pass = await prisma.userPass.create({
      data: {
        userId,
        type: passType,
        remainingUses: count,
        purchaseDate: new Date(),
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90일 후 만료
      },
    });

    return {
      passId: pass.id,
    };
  }

  /**
   * 구독 정보 조회
   * @param subscriptionId - 구독 ID
   * @returns 구독 정보
   */
  async getSubscription(subscriptionId: string): Promise<UserSubscription | null> {
    const subscription = await prisma.userSubscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return null;
    }

    return {
      userId: subscription.userId,
      plan: subscription.plan as SubscriptionPlan,
      status: subscription.status as UserSubscription['status'],
      startDate: subscription.startDate,
      endDate: subscription.endDate || undefined,
      providerSubscriptionId: subscription.providerSubscriptionId || undefined,
    };
  }

  /**
   * 패스 정보 조회
   * @param passId - 패스 ID
   * @returns 패스 정보
   */
  async getPass(passId: string): Promise<UserPass | null> {
    const pass = await prisma.userPass.findUnique({
      where: { id: passId },
    });

    if (!pass) {
      return null;
    }

    return {
      userId: pass.userId,
      type: pass.type as PassType,
      remainingUses: pass.remainingUses,
      purchaseDate: pass.purchaseDate,
      expiryDate: pass.expiryDate || undefined,
    };
  }
}

/**
 * Mock Payment Provider 인스턴스
 */
export const mockPaymentProvider = new MockPaymentProvider();

