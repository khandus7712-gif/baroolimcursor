/**
 * 이메일/비밀번호 회원가입 API (Pages Router)
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: '이메일과 비밀번호를 입력해주세요.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        error: '올바른 이메일 형식이 아닙니다.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: '비밀번호는 최소 6자 이상이어야 합니다.',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return res.status(409).json({
        error: '이미 사용 중인 이메일입니다.',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: name?.trim() || null,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      user,
      message: '회원가입이 완료되었습니다.',
    });
  } catch (error: any) {
    console.error('🔴 [REGISTER] 오류:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        error: '이미 사용 중인 이메일입니다.',
      });
    }

    return res.status(500).json({
      error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
}
