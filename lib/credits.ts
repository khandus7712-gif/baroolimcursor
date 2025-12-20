/**
 * 크레딧 관리 유틸리티
 * 플랜별 제한 체크 및 크레딧 차감
 */

import { prisma } from '@/lib/prisma';

/**
 * 플랜별 월간 제한
 */
const PLAN_MONTHLY_LIMITS: Record<string, number> = {
  FREE: 0, // FREE는 월간 제한 없음 (평생 5회만)
  LITE: 30, // Lite: 월 30개
  BASIC: 150, // Starter: 월 150개
  PRO: 400, // Growth: 월 400개
  ENTERPRISE: 0, // 사용 안 함
};

/**
 * 플랜별 평생 제한
 */
const PLAN_TOTAL_LIMITS: Record<string, number> = {
  FREE: 5,
  LITE: 0, // 무제한
  BASIC: 0, // 무제한
  PRO: 0, // 무제한
  ENTERPRISE: 0, // 무제한
};

/**
 * 생성 가능 여부 체크
 * @param userId - 사용자 ID
 * @returns 생성 가능 여부 및 에러 메시지
 */
export async function checkGenerationLimit(userId: string): Promise<{
  canGenerate: boolean;
  error?: string;
  remaining?: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { canGenerate: false, error: '사용자를 찾을 수 없습니다.' };
  }

  // 패스가 있으면 패스 사용 가능
  const hasPass = await prisma.userPass.findFirst({
    where: {
      userId,
      remainingUses: { gt: 0 },
      OR: [
        { expiryDate: null },
        { expiryDate: { gt: new Date() } },
      ],
    },
  });

  if (hasPass) {
    return { canGenerate: true, remaining: hasPass.remainingUses };
  }

  // FREE 플랜: 평생 5회 제한
  if (user.plan === 'FREE') {
    const totalLimit = PLAN_TOTAL_LIMITS.FREE;
    if (user.totalGenerations >= totalLimit) {
      return {
        canGenerate: false,
        error: `무료 체험 5회를 모두 사용하셨어요 🎉\n\n마음에 드셨다면, 유료 플랜으로 계속 사용해보세요.\n\n• 생성 제한 없이 사용\n• 카드 등록은 결제 시에만 진행돼요`,
        remaining: 0,
      };
    }
    return {
      canGenerate: true,
      remaining: totalLimit - user.totalGenerations,
    };
  }

  // 유료 플랜: 월간 제한
  const monthlyLimit = PLAN_MONTHLY_LIMITS[user.plan] || 0;
  if (monthlyLimit === 0) {
    return { canGenerate: true }; // 제한 없음
  }

  // 월 체크 및 리셋
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  currentMonth.setHours(0, 0, 0, 0);

  const lastGenMonth = user.lastGenerationMonth;
  if (lastGenMonth) {
    const lastMonth = new Date(lastGenMonth);
    lastMonth.setHours(0, 0, 0, 0);

    // 월이 바뀌었으면 카운트 리셋
    if (lastMonth.getTime() !== currentMonth.getTime()) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          monthlyGenerationCount: 0,
          lastGenerationMonth: currentMonth,
        },
      });
      user.monthlyGenerationCount = 0;
    }
  }

  if (user.monthlyGenerationCount >= monthlyLimit) {
    return {
      canGenerate: false,
      error: `이번 달 생성 한도를 모두 사용하셨어요 🎉\n다음 달에 다시 ${monthlyLimit}회가 자동으로 충전됩니다.`,
      remaining: 0,
    };
  }

  return {
    canGenerate: true,
    remaining: monthlyLimit - user.monthlyGenerationCount,
  };
}

/**
 * 크레딧 차감 (생성 후 호출)
 * @param userId - 사용자 ID
 * @returns 차감 성공 여부
 */
export async function deductGeneration(userId: string): Promise<boolean> {
  // 먼저 패스가 있는지 확인
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

  if (pass) {
    // 패스 사용
    await prisma.userPass.update({
      where: { id: pass.id },
      data: {
        remainingUses: { decrement: 1 },
      },
    });
    return true;
  }

  // 패스가 없으면 플랜 기반 차감
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (user.plan === 'FREE') {
    // FREE: 평생 카운트 증가
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalGenerations: { increment: 1 },
      },
    });
  } else {
    // 유료 플랜: 월간 카운트 증가
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    currentMonth.setHours(0, 0, 0, 0);

    const lastGenMonth = user.lastGenerationMonth;
    let shouldReset = false;

    if (lastGenMonth) {
      const lastMonth = new Date(lastGenMonth);
      lastMonth.setHours(0, 0, 0, 0);
      if (lastMonth.getTime() !== currentMonth.getTime()) {
        shouldReset = true;
      }
    } else {
      shouldReset = true;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyGenerationCount: shouldReset ? 1 : { increment: 1 },
        lastGenerationMonth: currentMonth,
      },
    });
  }

  return true;
}

