/**
 * 관리자 계정 설정 API
 * 환경 변수 ADMIN_SECRET으로 보호
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 보안: ADMIN_SECRET 확인
    const adminSecret = process.env.ADMIN_SECRET;
    const providedSecret = req.headers['x-admin-secret'] || req.body.secret;

    if (!adminSecret || providedSecret !== adminSecret) {
      return res.status(403).json({ error: '권한이 없습니다.' });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: '이메일이 필요합니다.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    return res.status(200).json({
      success: true,
      message: `${email} 계정이 관리자로 설정되었습니다.`,
    });
  } catch (error) {
    console.error('Set admin API error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}


