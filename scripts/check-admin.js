/**
 * 관리자 계정 확인 스크립트
 */

require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@baroolim.com' },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
      },
    });

    if (admin) {
      console.log('✅ 관리자 계정 정보:');
      console.log(JSON.stringify(admin, null, 2));
    } else {
      console.log('❌ 관리자 계정을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('❌ 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();



