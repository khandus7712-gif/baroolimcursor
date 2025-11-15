/**
 * 사전예약 API
 * 대기자 명단 등록
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name, company, phone, interest, message } = req.body;

    // 이메일 필수 체크
    if (!email) {
      return res.status(400).json({ error: '이메일을 입력해주세요.' });
    }

    // 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '올바른 이메일 형식이 아닙니다.' });
    }

    // 이미 등록된 이메일인지 체크
    const existing = await prisma.waitlist.findUnique({
      where: { email },
    });

    if (existing) {
      return res.status(400).json({ error: '이미 등록된 이메일입니다.' });
    }

    // 대기자 명단에 추가
    const waitlist = await prisma.waitlist.create({
      data: {
        email,
        name: name || null,
        company: company || null,
        phone: phone || null,
        interest: interest || null,
        message: message || null,
        source: req.headers.referer || 'direct',
      },
    });

    // 성공 응답
    return res.status(201).json({
      success: true,
      message: '사전예약이 완료되었습니다!',
      id: waitlist.id,
    });
  } catch (error) {
    console.error('Waitlist registration error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

