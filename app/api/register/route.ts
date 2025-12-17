/**
 * 이메일/비밀번호 회원가입 API (App Router)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      const res = NextResponse.json(
        { error: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      );
      res.headers.set('x-hit-register-route', 'v2');
      return res;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      const res = NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
      res.headers.set('x-hit-register-route', 'v2');
      return res;
    }

    if (password.length < 6) {
      const res = NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
      res.headers.set('x-hit-register-route', 'v2');
      return res;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      const res = NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
      res.headers.set('x-hit-register-route', 'v2');
      return res;
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

    const res = NextResponse.json(
      {
        success: true,
        user,
        message: '회원가입이 완료되었습니다.',
      },
      { status: 201 }
    );
    res.headers.set('x-hit-register-route', 'v2');
    return res;
  } catch (error: any) {
    console.error('🔴 [REGISTER] 오류:', error);

    if (error.code === 'P2002') {
      const res = NextResponse.json(
        { error: '이미 사용 중인 이메일입니다.' },
        { status: 409 }
      );
      res.headers.set('x-hit-register-route', 'v2');
      return res;
    }

    const res = NextResponse.json(
      {
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      { status: 500 }
    );
    res.headers.set('x-hit-register-route', 'v2');
    return res;
  }
}
