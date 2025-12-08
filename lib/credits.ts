/**
 * 크레딧 관리 유틸리티
 * 플랜별 제한 체크 및 크레딧 차감
 */

import { prisma } from '@/lib/prisma';

/**
 * 플랜별 일일 제한
 */
const PLAN_DAILY_LIMITS: Record<string, number> = {
  FREE: 0, // FREE는 일일 제한 없음 (평생 5회만)
  BASIC: 3,
  PRO: 10,
  ENTERPRISE: 30,
};

/**
 * 플랜별 평생 제한
 */
const PLAN_TOTAL_LIMITS: Record<string, number> = {
  FREE: 5,
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
        error: `평생 생성 횟수(${totalLimit}회)를 모두 사용하셨습니다. 유료 플랜으로 업그레이드하세요.`,
        remaining: 0,
      };
    }
    return {
      canGenerate: true,
      remaining: totalLimit - user.totalGenerations,
    };
  }

  // 유료 플랜: 일일 제한
  const dailyLimit = PLAN_DAILY_LIMITS[user.plan] || 0;
  if (dailyLimit === 0) {
    return { canGenerate: true }; // 제한 없음
  }

  // 날짜 체크 및 리셋
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastGenDate = user.lastGenerationDate;
  if (lastGenDate) {
    const lastDate = new Date(lastGenDate);
    lastDate.setHours(0, 0, 0, 0);

    // 날짜가 바뀌었으면 카운트 리셋
    if (lastDate.getTime() !== today.getTime()) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          dailyGenerationCount: 0,
          lastGenerationDate: today,
        },
      });
      user.dailyGenerationCount = 0;
    }
  }

  if (user.dailyGenerationCount >= dailyLimit) {
    return {
      canGenerate: false,
      error: `일일 생성 횟수(${dailyLimit}회)를 모두 사용하셨습니다. 내일 다시 시도하세요.`,
      remaining: 0,
    };
  }

  return {
    canGenerate: true,
    remaining: dailyLimit - user.dailyGenerationCount,
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
    // 유료 플랜: 일일 카운트 증가
    const lastGenDate = user.lastGenerationDate;
    let shouldReset = false;

    if (lastGenDate) {
      const lastDate = new Date(lastGenDate);
      lastDate.setHours(0, 0, 0, 0);
      if (lastDate.getTime() !== today.getTime()) {
        shouldReset = true;
      }
    } else {
      shouldReset = true;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyGenerationCount: shouldReset ? 1 : { increment: 1 },
        lastGenerationDate: today,
      },
    });
  }

  return true;
}

