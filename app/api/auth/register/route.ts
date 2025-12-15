/**
 * 이메일/비밀번호 회원가입 API
 */

import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    // Request body 파싱
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: '요청 데이터 형식이 올바르지 않습니다.' },
        { status: 400 }
      );
    }

    const { email, password, name } = body as {
      email?: string;
      password?: string;
      name?: string;
    };

    // 입력 검증
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: '이메일을 입력해주세요.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: '비밀번호를 입력해주세요.' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: '올바른 이메일 형식이 아닙니다.' },
        { status: 400 }
      );
    }

    // 비밀번호 길이 검증 (최소 6자, 최대 100자)
    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      );
    }

    if (password.length > 100) {
      return NextResponse.json(
        { error: '비밀번호는 100자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 이름 검증 (선택사항이지만 있다면 길이 제한)
    if (name && typeof name === 'string' && name.length > 100) {
      return NextResponse.json(
        { error: '이름은 100자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 중복 이메일 확인
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: '이미 사용 중인 이메일입니다.' },
          { status: 409 }
        );
      }
    } catch (dbError) {
      console.error('🔴 [REGISTER] DB 조회 오류:', dbError);
      return NextResponse.json(
        { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    // 비밀번호 해시
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error('🔴 [REGISTER] 비밀번호 해시 오류:', hashError);
      return NextResponse.json(
        { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    // 사용자 생성
    let user;
    try {
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: name && name.trim() ? name.trim() : null,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });
    } catch (createError: any) {
      console.error('🔴 [REGISTER] 사용자 생성 오류:', createError);

      // Prisma unique constraint 오류 처리
      if (createError.code === 'P2002') {
        return NextResponse.json(
          { error: '이미 사용 중인 이메일입니다.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.' },
        { status: 500 }
      );
    }

    console.log('✅ [REGISTER] 회원가입 성공:', {
      id: user.id,
      email: user.email,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        message: '회원가입이 완료되었습니다.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('🔴 [REGISTER] 예상치 못한 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      },
      { status: 500 }
    );
  }
}

