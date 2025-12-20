import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '이메일과 비밀번호는 필수입니다.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const exists = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (exists) {
      return NextResponse.json(
        { error: '이미 가입된 이메일입니다.' },
        { status: 409 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hashed,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return NextResponse.json(
      { success: true, user },
      { status: 201 }
    );
  } catch (e) {
    console.error('[REGISTER ERROR]', e);
    return NextResponse.json(
      { error: '서버 오류' },
      { status: 500 }
    );
  }
}
