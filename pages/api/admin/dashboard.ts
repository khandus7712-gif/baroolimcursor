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

    // TODO: 실제 환경에서는 관리자 권한 체크 필요
    // 현재는 로그인한 모든 사용자가 접근 가능
    // const isAdmin = session.user.role === 'ADMIN';
    // if (!isAdmin) {
    //   return res.status(403).json({ error: '권한이 없습니다.' });
    // }

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
        monthlyGenerationCount: true,
        lastGenerationMonth: true,
        createdAt: true,
      },
    });

    // 사전예약 목록 (최신순)
    const waitlist = await prisma.waitlist.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 월 매출 (결제 시스템 연동 전까지는 0)
    const monthlyRevenue = 0;

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
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

