/**
 * 관리자 대시보드 API
 * 통계 및 회원 정보 조회
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 인증 확인
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }

    // 관리자 권한 체크
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: '관리자 권한이 필요합니다.' });
    }

    // 통계 데이터 수집
    const totalUsers = await prisma.user.count();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySignups = await prisma.user.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    const freeUsers = await prisma.user.count({
      where: {
        plan: 'FREE',
      },
    });

    const paidUsers = totalUsers - freeUsers;

    const generationsAgg = await prisma.user.aggregate({
      _sum: {
        totalGenerations: true,
      },
    });
    const totalGenerations = generationsAgg._sum.totalGenerations || 0;

    const waitlistCount = await prisma.waitlist.count();

    // 회원 목록 (최신순, 상위 100명)
    const users = await prisma.user.findMany({
      take: 100,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        totalGenerations: true,
        dailyGenerationCount: true,
        createdAt: true,
      },
    });

    // 사전예약 목록 (최신순)
    const waitlist = await prisma.waitlist.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 월 매출 계산 (이번 달 완료된 결제 합계)
    const thisMonthStart = new Date();
    thisMonthStart.setDate(1);
    thisMonthStart.setHours(0, 0, 0, 0);
    
    const monthlyPayments = await prisma.payment.aggregate({
      where: {
        status: 'COMPLETED',
        paidAt: {
          gte: thisMonthStart,
        },
      },
      _sum: {
        amount: true,
      },
    });
    const monthlyRevenue = monthlyPayments._sum.amount || 0;

    // 결제 내역 (최신순, 상위 50개)
    const payments = await prisma.payment.findMany({
      take: 50,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      stats: {
        totalUsers,
        todaySignups,
        totalGenerations,
        monthlyRevenue,
        freeUsers,
        paidUsers,
        waitlistCount,
      },
      users: users.map(user => ({
        ...user,
        email: user.email || 'anonymous',
      })),
      waitlist,
      payments: payments.map(payment => ({
        id: payment.id,
        orderId: payment.orderId,
        userId: payment.userId,
        userEmail: payment.user.email || 'anonymous',
        userName: payment.user.name,
        planId: payment.planId,
        planName: payment.planName,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      })),
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

