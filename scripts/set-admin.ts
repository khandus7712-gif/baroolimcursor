/**
 * 관리자 계정 설정 스크립트
 * 사용법: npx tsx scripts/set-admin.ts <이메일>
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ 사용자를 찾을 수 없습니다: ${email}`);
      console.log('\n💡 먼저 해당 이메일로 회원가입을 해주세요.');
      process.exit(1);
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`✅ ${email} 계정이 관리자로 설정되었습니다!`);
    console.log(`\n📊 관리자 대시보드: https://baroolim.com/admin/dashboard`);
  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];

if (!email) {
  console.error('❌ 이메일을 입력해주세요.');
  console.log('\n사용법: npx tsx scripts/set-admin.ts <이메일>');
  console.log('예시: npx tsx scripts/set-admin.ts admin@baroolim.com');
  process.exit(1);
}

setAdmin(email);


